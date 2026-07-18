from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Payload for POST /users."""
    username: str
    email: EmailStr


class UserResponse(BaseModel):
    """Public user representation."""
    id: str
    username: str
    email: str
