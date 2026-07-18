from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CheckInBase(BaseModel):
    progress: float
    mood: str
    note: Optional[str] = None
    ai_feedback: Optional[str] = None


class CheckInCreate(CheckInBase):
    habit_id: str


class CheckInResponse(CheckInBase):
    id: str
    habit_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
