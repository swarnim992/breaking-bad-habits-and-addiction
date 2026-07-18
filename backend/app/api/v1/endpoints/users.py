from fastapi import APIRouter

from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()
user_service = UserService()


@router.get("", response_model=list[UserResponse], summary="List all users")
async def list_users():
    """Return all users (skeleton — no DB yet)."""
    return user_service.get_all()


@router.post("", response_model=UserResponse, status_code=201, summary="Create a user")
async def create_user(payload: UserCreate):
    """Create a new user."""
    return user_service.create_user(payload)


@router.get("/{user_id}", response_model=UserResponse, summary="Get user by ID")
async def get_user(user_id: str):
    """Fetch a single user by ID."""
    return user_service.get_by_id(user_id)
