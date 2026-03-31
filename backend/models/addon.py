from sqlalchemy import Column, Integer, String, Boolean, Date, Text, JSON, ForeignKey
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
    
    # Code changes — stores array of {file_name, line_range, original_code, modified_code}
    has_custom_changes = Column(Boolean, default=False)
    code_modifications = Column(JSON, default=[])
    
    # Link to user
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)