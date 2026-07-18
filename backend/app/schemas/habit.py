from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class HabitBase(BaseModel):
    habit_name: str
    current_level: float
    target_level: float
    trigger: str
    motivation: str
    ai_plan: Optional[str] = None


class HabitCreate(HabitBase):
    user_id: str


class HabitUpdate(BaseModel):
    habit_name: Optional[str] = None
    current_level: Optional[float] = None
    target_level: Optional[float] = None
    trigger: Optional[str] = None
    motivation: Optional[str] = None
    ai_plan: Optional[str] = None


class HabitResponse(HabitBase):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
