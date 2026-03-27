from sqlalchemy import Column, Integer, String, Boolean, Date, Text, ForeignKey
from config.database import Base

class Addon(Base):
    __tablename__ = "addons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    author = Column(String)
    version = Column(String)
    category = Column(String)
    esoui_link = Column(String)
    install_date = Column(Date)
    last_updated = Column(Date)
    is_active = Column(Boolean, default=True)
    personal_notes = Column(Text)
    rating = Column(Integer)
    
    # Code changes fields
    has_custom_changes = Column(Boolean, default=False)
    code_line_range = Column(String)
    original_code = Column(Text)
    modified_code = Column(Text)
    
    # Link to user
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)