from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from typing import Optional

from config.database import get_db
from models.user import User
from schemas.auth import UserRegister, UserLogin, UserResponse
from utils.password import hash_password, verify_password
from utils.auth import create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user_data: UserRegister, response: Response, db: Session = Depends(get_db)):
    """Register a new user and automatically log them in"""
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Hash password and create user
    hashed_pw = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        password=hashed_pw
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create JWT token and set cookie (auto-login after registration)
    token_data = {
        "user_id": new_user.id,
        "username": new_user.username
    }
    access_token = create_access_token(data=token_data)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=86400,  # 24 hours
        samesite="lax",
        secure=False
    )
    
    return new_user


@router.post("/login", response_model=UserResponse)
async def login(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Login user and set JWT token as HTTP-only cookie"""
    # Find user
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, str(user.password)):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    token_data = {
        "user_id": user.id,
        "username": user.username
    }
    access_token = create_access_token(data=token_data)
    
    # Set HTTP-only cookie with JWT token
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Prevents JavaScript access
        max_age=86400,  # 24 hours
        samesite="lax",
        secure=False
    )
    
    return user


@router.post("/logout")
async def logout(response: Response):
    """Logout user by clearing JWT cookie"""
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    access_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    """Get current logged-in user from JWT token"""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = decode_access_token(access_token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


@router.get("/secret")
async def get_secret(
    access_token: Optional[str] = Cookie(None)
):
    """
    Protected endpoint that requires authentication.
    Test endpoint to verify JWT authentication works.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = decode_access_token(access_token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {
        "message": "This is a secret message!",
        "secret": "The answer to life, the universe, and everything is 42",
        "user": {
            "user_id": payload.get("user_id"),
            "username": payload.get("username")
        },
        "note": "You can only see this because you are authenticated with a valid JWT token!"
    }