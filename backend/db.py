
import os
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, create_engine, Session, select
from sqlmodel import Relationship

DB_URL = os.getenv("DB_URL", "sqlite:///./db.sqlite")
engine = create_engine(DB_URL, connect_args={"check_same_thread": False})

class ContactRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    phone: str
    whatsapp: Optional[str] = None
    query: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    excerpt: str
    content: str
    tags_csv: str = ""   # comma-separated for simplicity
    published_date: datetime = Field(default_factory=datetime.utcnow)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)
