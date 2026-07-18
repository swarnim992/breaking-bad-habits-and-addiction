from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class UrgeEventBase(BaseModel):
    feeling: str
    ai_response: Optional[str] = None
    outcome: str = "pending"  # resisted, gave_in, pending


class UrgeEventCreate(UrgeEventBase):
    habit_id: str


class UrgeEventUpdate(BaseModel):
    outcome: str


class UrgeEventResponse(UrgeEventBase):
    id: str
    habit_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
