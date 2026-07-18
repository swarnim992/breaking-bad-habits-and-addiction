import uuid
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.habit import Habit
from app.models.urge_event import UrgeEvent
from app.schemas.urge_event import UrgeEventCreate


class UrgeService:
    def create_urge(self, db: Session, payload: UrgeEventCreate) -> UrgeEvent:
        """Create a new urge event. Verify habit exists first."""
        habit = db.query(Habit).filter(Habit.id == payload.habit_id).first()
        if not habit:
            raise NotFoundError("Habit")

        # Validate outcome value
        if payload.outcome not in ["resisted", "gave_in", "pending"]:
            raise ConflictError("Outcome must be one of: resisted, gave_in, pending")

        urge = UrgeEvent(
            id=str(uuid.uuid4()),
            habit_id=payload.habit_id,
            feeling=payload.feeling,
            ai_response=payload.ai_response,
            outcome=payload.outcome,
        )
        db.add(urge)
        db.commit()
        db.refresh(urge)
        return urge

    def update_urge_outcome(self, db: Session, urge_id: str, outcome: str) -> UrgeEvent:
        """Update the outcome of an urge event."""
        if outcome not in ["resisted", "gave_in", "pending"]:
            raise ConflictError("Outcome must be one of: resisted, gave_in, pending")

        urge = db.query(UrgeEvent).filter(UrgeEvent.id == urge_id).first()
        if not urge:
            raise NotFoundError("Urge event")

        urge.outcome = outcome
        db.commit()
        db.refresh(urge)
        return urge

    def get_by_habit_id(self, db: Session, habit_id: str) -> list[UrgeEvent]:
        """Fetch all urge events for a specific habit. Verify habit exists first."""
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
        if not habit:
            raise NotFoundError("Habit")
        return db.query(UrgeEvent).filter(UrgeEvent.habit_id == habit_id).order_by(UrgeEvent.created_at.desc()).all()
