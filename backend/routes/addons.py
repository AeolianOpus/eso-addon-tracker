from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from config.database import get_db
from models.addon import Addon
from schemas.addon import Addon as AddonSchema, AddonCreate, AddonUpdate
from utils.auth import get_current_user_id

router = APIRouter(prefix="/addons", tags=["addons"])


@router.post("/", response_model=AddonSchema, status_code=201)
async def create_addon(
    addon: AddonCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Create a new addon for the authenticated user"""
    addon_data = addon.model_dump()
    # Serialize CodeModification objects to dicts for JSON column
    addon_data["code_modifications"] = [m.model_dump() if hasattr(m, 'model_dump') else m for m in addon_data.get("code_modifications", [])]
    db_addon = Addon(**addon_data, user_id=user_id)
    db.add(db_addon)
    db.commit()
    db.refresh(db_addon)
    return db_addon


@router.get("/", response_model=List[AddonSchema])
async def get_addons(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Get all addons for the authenticated user"""
    return db.query(Addon).filter(Addon.user_id == user_id).all()


@router.get("/{addon_id}", response_model=AddonSchema)
async def get_addon(
    addon_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Get a specific addon"""
    addon = db.query(Addon).filter(
        Addon.id == addon_id,
        Addon.user_id == user_id
    ).first()
    
    if not addon:
        raise HTTPException(status_code=404, detail="Addon not found")
    
    return addon


@router.put("/{addon_id}", response_model=AddonSchema)
async def update_addon(
    addon_id: int,
    addon_update: AddonUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Update an addon"""
    addon = db.query(Addon).filter(
        Addon.id == addon_id,
        Addon.user_id == user_id
    ).first()
    
    if not addon:
        raise HTTPException(status_code=404, detail="Addon not found")
    
    for key, value in addon_update.model_dump(exclude_unset=True).items():
        if key == "code_modifications" and value is not None:
            value = [m.model_dump() if hasattr(m, 'model_dump') else m for m in value]
        setattr(addon, key, value)
    
    db.commit()
    db.refresh(addon)
    return addon


@router.delete("/{addon_id}", status_code=204)
async def delete_addon(
    addon_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Delete an addon"""
    addon = db.query(Addon).filter(
        Addon.id == addon_id,
        Addon.user_id == user_id
    ).first()
    
    if not addon:
        raise HTTPException(status_code=404, detail="Addon not found")
    
    db.delete(addon)
    db.commit()
    return None