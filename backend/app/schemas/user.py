from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    """Payload for POST /users (optional custom user_id)."""
    id: Optional[str] = None


class UserResponse(BaseModel):
    """Public user representation."""
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
