from sqlalchemy import Column, Integer, String, Boolean, Date
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
    personal_notes = Column(String)
    rating = Column(Integer)