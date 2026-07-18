from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.habit import HabitCreate, HabitResponse
from app.services.habit_service import HabitService

router = APIRouter()
habit_service = HabitService()


@router.post("", response_model=HabitResponse, status_code=201, summary="Create a habit")
async def create_habit(payload: HabitCreate, db: Session = Depends(get_db)):
    """Create a new habit for an anonymous user."""
    return habit_service.create_habit(db, payload)


@router.get("/{habit_id}", response_model=HabitResponse, summary="Get habit by ID")
async def get_habit(habit_id: str, db: Session = Depends(get_db)):
    """Fetch details of a single habit by ID."""
    return habit_service.get_by_id(db, habit_id)


@router.get("", response_model=List[HabitResponse], summary="List habits")
async def list_habits(
    user_id: Optional[str] = Query(None, description="Filter habits by user ID"),
    db: Session = Depends(get_db),
):
    """Retrieve habits, optionally filtered by user ID."""
    if user_id:
        return habit_service.get_by_user_id(db, user_id)
    from app.models.habit import Habit
    return db.query(Habit).all()


@router.get("/user/{user_id}", response_model=List[HabitResponse], summary="Get habits by User ID")
async def get_habits_by_user(user_id: str, db: Session = Depends(get_db)):
    """Retrieve all habits for a specific user."""
    return habit_service.get_by_user_id(db, user_id)
