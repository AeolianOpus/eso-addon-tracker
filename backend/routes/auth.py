from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from typing import Optional

from config.database import get_db
from models.user import User
from schemas.auth import UserRegister, UserLogin, UserResponse
from utils.password import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
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
    
    return new_user


@router.post("/login", response_model=UserResponse)
async def login(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Login user and set session cookie"""
    # Find user
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, str(user.password)):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Set session cookie
    response.set_cookie(
        key="session_user_id",
        value=str(user.id),
        httponly=True,
        max_age=86400 * 7,  # 7 days
        samesite="lax"
    )
    
    return user


@router.post("/logout")
async def logout(response: Response):
    """Logout user by clearing session cookie"""
    response.delete_cookie(key="session_user_id")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    session_user_id: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    """Get current logged-in user"""
    if not session_user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        user_id = int(session_user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user