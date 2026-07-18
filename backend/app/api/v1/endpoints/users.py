from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()
user_service = UserService()


@router.get("", response_model=list[UserResponse], summary="List all users")
async def list_users(db: Session = Depends(get_db)):
    """Return all users."""
    return user_service.get_all(db)


@router.post("", response_model=UserResponse, status_code=201, summary="Create a user")
async def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    """Create a new anonymous user."""
    return user_service.create_user(db, payload)


@router.get("/{user_id}", response_model=UserResponse, summary="Get user by ID")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    """Fetch a single user by ID."""
    return user_service.get_by_id(db, user_id)
