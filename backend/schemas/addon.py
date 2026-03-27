from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class AddonBase(BaseModel):
    name: str = Field(..., description="Name of the addon")
    author: Optional[str] = Field(None, description="Author of the addon")
    version: Optional[str] = Field(None, description="Version number")
    category: Optional[str] = Field(None, description="Category (UI, Combat, Crafting, Map, etc)")
    esoui_link: Optional[str] = Field(None, description="Link to ESOUI page")
    install_date: Optional[date] = Field(None, description="When addon was installed")
    last_updated: Optional[date] = Field(None, description="Last update date")
    is_active: bool = Field(True, description="Is addon currently active")
    personal_notes: Optional[str] = Field(None, description="Personal notes about the addon")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating from 1-5")
    has_custom_changes: bool = Field(False, description="Has custom code modifications")
    code_line_range: Optional[str] = Field(None, description="Line range of changes (e.g., '600-612')")
    original_code: Optional[str] = Field(None, description="Original code before modifications")
    modified_code: Optional[str] = Field(None, description="Modified code after changes")

class AddonCreate(AddonBase):
    pass

class AddonUpdate(BaseModel):
    name: Optional[str] = None
    author: Optional[str] = None
    version: Optional[str] = None
    category: Optional[str] = None
    esoui_link: Optional[str] = None
    install_date: Optional[date] = None
    last_updated: Optional[date] = None
    is_active: Optional[bool] = None
    personal_notes: Optional[str] = None
    rating: Optional[int] = None
    has_custom_changes: Optional[bool] = None
    code_line_range: Optional[str] = None
    original_code: Optional[str] = None
    modified_code: Optional[str] = None

class Addon(AddonBase):
    id: int

    class Config:
        from_attributes = True