import uuid
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.checkin import CheckIn
from app.models.habit import Habit
from app.schemas.checkin import CheckInCreate
from app.services.ai_service import AiService


class CheckInService:
    def __init__(self):
        self.ai_service = AiService()

    def create_checkin(self, db: Session, payload: CheckInCreate) -> CheckIn:
        """Log a new check-in for a habit and generate AI feedback."""
        habit = db.query(Habit).filter(Habit.id == payload.habit_id).first()
        if not habit:
            raise NotFoundError("Habit")

        recent_checkins = (
            db.query(CheckIn)
            .filter(CheckIn.habit_id == payload.habit_id)
            .order_by(CheckIn.created_at.desc())
            .limit(5)
            .all()
        )
        recent_progress = [c.progress for c in reversed(recent_checkins)]

        ai_feedback = self.ai_service.generate_checkin_feedback(
            habit_name=habit.habit_name,
            unit=habit.unit or "units",
            current_level=habit.current_level,
            target_level=habit.target_level,
            trigger=habit.trigger,
            motivation=habit.motivation,
            mood=payload.mood,
            progress=payload.progress,
            note=payload.note,
            recent_progress=recent_progress,
        )

        checkin = CheckIn(
            id=str(uuid.uuid4()),
            habit_id=payload.habit_id,
            progress=payload.progress,
            mood=payload.mood,
            note=payload.note,
            ai_feedback=ai_feedback,
        )
        db.add(checkin)
        db.commit()
        db.refresh(checkin)
        return checkin

    def get_by_habit_id(self, db: Session, habit_id: str) -> list[CheckIn]:
        """Fetch all check-ins for a specific habit. Verify habit exists first."""
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
        if not habit:
            raise NotFoundError("Habit")
        return db.query(CheckIn).filter(CheckIn.habit_id == habit_id).order_by(CheckIn.created_at.desc()).all()
