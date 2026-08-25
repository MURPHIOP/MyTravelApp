from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    size = Column(Integer)
    url = Column(String)
    uploadedBy = Column(String)
    uploadedAt = Column(DateTime, default=datetime.datetime.utcnow)
    family = Column(String)
