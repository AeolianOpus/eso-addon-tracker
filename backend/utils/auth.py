from fastapi import HTTPException, Cookie
from typing import Optional


def get_current_user_id(session_user_id: Optional[str] = Cookie(None)) -> int:
    """
    Get current user ID from session cookie.
    Raises 401 if not authenticated.
    """
    if not session_user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        return int(session_user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid session")