from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class CodeModification(BaseModel):
    file_name: str = Field(..., description="Filename, e.g. craftStationScenes.lua")
    line_range: str = Field(..., description="Line range, e.g. 62-64")
    original_code: str = Field("", description="Original code before modifications")
    modified_code: str = Field("", description="Modified code after changes")

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
    code_modifications: list[CodeModification] = Field(default_factory=list, description="List of code modifications")

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
    code_modifications: Optional[list[CodeModification]] = None

class Addon(AddonBase):
    id: int

    class Config:
        from_attributes = True