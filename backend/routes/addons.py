from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from config.database import get_db
from models import addon as models
from schemas import addon as schemas

router = APIRouter(
    prefix="/addons",
    tags=["addons"]
)

# CREATE - POST /addons
@router.post("/", response_model=schemas.Addon, status_code=status.HTTP_201_CREATED)
async def create_addon(addon: schemas.AddonCreate, db: Session = Depends(get_db)):
    db_addon = models.Addon(**addon.model_dump())
    db.add(db_addon)
    db.commit()
    db.refresh(db_addon)
    return db_addon

# READ ALL - GET /addons
@router.get("/", response_model=List[schemas.Addon])
async def get_all_addons(db: Session = Depends(get_db)):
    addons = db.query(models.Addon).all()
    return addons

# READ ONE - GET /addons/{id}
@router.get("/{addon_id}", response_model=schemas.Addon)
async def get_addon(addon_id: int, db: Session = Depends(get_db)):
    addon = db.query(models.Addon).filter(models.Addon.id == addon_id).first()
    if not addon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Addon not found")
    return addon

# UPDATE - PUT /addons/{id}
@router.put("/{addon_id}", response_model=schemas.Addon)
async def update_addon(addon_id: int, addon_update: schemas.AddonUpdate, db: Session = Depends(get_db)):
    addon = db.query(models.Addon).filter(models.Addon.id == addon_id).first()
    if not addon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Addon not found")
    
    update_data = addon_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(addon, key, value)
    
    db.commit()
    db.refresh(addon)
    return addon

# DELETE - DELETE /addons/{id}
@router.delete("/{addon_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_addon(addon_id: int, db: Session = Depends(get_db)):
    addon = db.query(models.Addon).filter(models.Addon.id == addon_id).first()
    if not addon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Addon not found")
    
    db.delete(addon)
    db.commit()
    return None