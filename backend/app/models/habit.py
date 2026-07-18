from datetime import datetime
import uuid
from sqlalchemy import Column, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Habit(Base):
    __tablename__ = "habits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    habit_name = Column(String, nullable=False)
    current_level = Column(Float, nullable=False)
    target_level = Column(Float, nullable=False)
    trigger = Column(Text, nullable=False)
    motivation = Column(Text, nullable=False)
    ai_plan = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="habits")
    checkins = relationship("CheckIn", back_populates="habit", cascade="all, delete-orphan")
    urge_events = relationship("UrgeEvent", back_populates="habit", cascade="all, delete-orphan")
