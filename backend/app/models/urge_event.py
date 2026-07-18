from datetime import datetime
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class UrgeEvent(Base):
    __tablename__ = "urge_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    habit_id = Column(String, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    feeling = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=True)
    outcome = Column(String, default="pending", nullable=False)  # resisted, gave_in, pending
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    habit = relationship("Habit", back_populates="urge_events")
