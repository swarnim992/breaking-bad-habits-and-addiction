from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.checkin import CheckInCreate, CheckInResponse
from app.services.checkin_service import CheckInService

router = APIRouter()
checkin_service = CheckInService()


@router.post("", response_model=CheckInResponse, status_code=201, summary="Log a check-in")
async def create_checkin(payload: CheckInCreate, db: Session = Depends(get_db)):
    """Create a daily check-in for a habit."""
    return checkin_service.create_checkin(db, payload)


@router.get("", response_model=List[CheckInResponse], summary="List check-ins")
async def list_checkins(
    habit_id: Optional[str] = Query(None, description="Filter check-ins by habit ID"),
    db: Session = Depends(get_db),
):
    """Retrieve check-ins, optionally filtered by habit ID."""
    if habit_id:
        return checkin_service.get_by_habit_id(db, habit_id)
    from app.models.checkin import CheckIn
    return db.query(CheckIn).all()


@router.get("/habit/{habit_id}", response_model=List[CheckInResponse], summary="Get check-ins by Habit ID")
async def get_checkins_by_habit(habit_id: str, db: Session = Depends(get_db)):
    """Retrieve check-ins for a specific habit."""
    return checkin_service.get_by_habit_id(db, habit_id)
