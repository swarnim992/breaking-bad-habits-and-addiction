from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.urge_event import UrgeEventCreate, UrgeEventUpdate, UrgeEventResponse
from app.services.urge_service import UrgeService

router = APIRouter()
urge_service = UrgeService()


@router.post("", response_model=UrgeEventResponse, status_code=201, summary="Log an urge")
async def create_urge(payload: UrgeEventCreate, db: Session = Depends(get_db)):
    """Log a new urge event."""
    return urge_service.create_urge(db, payload)


@router.patch("/{urge_id}", response_model=UrgeEventResponse, summary="Update urge outcome")
async def update_urge_outcome(
    urge_id: str,
    payload: UrgeEventUpdate,
    db: Session = Depends(get_db),
):
    """Update the outcome of an urge event (e.g. resisted, gave_in)."""
    return urge_service.update_urge_outcome(db, urge_id, payload.outcome)


@router.get("", response_model=List[UrgeEventResponse], summary="List urge events")
async def list_urges(
    habit_id: Optional[str] = Query(None, description="Filter urges by habit ID"),
    db: Session = Depends(get_db),
):
    """Retrieve urge events, optionally filtered by habit ID."""
    if habit_id:
        return urge_service.get_by_habit_id(db, habit_id)
    from app.models.urge_event import UrgeEvent
    return db.query(UrgeEvent).all()


@router.get("/habit/{habit_id}", response_model=List[UrgeEventResponse], summary="Get urges by Habit ID")
async def get_urges_by_habit(habit_id: str, db: Session = Depends(get_db)):
    """Retrieve urge events for a specific habit."""
    return urge_service.get_by_habit_id(db, habit_id)
