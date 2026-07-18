import uuid
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.habit import Habit
from app.models.user import User
from app.schemas.habit import HabitCreate


class HabitService:
    def create_habit(self, db: Session, payload: HabitCreate) -> Habit:
        """Create a new habit for a user. Verify user exists first."""
        user = db.query(User).filter(User.id == payload.user_id).first()
        if not user:
            raise NotFoundError("User")

        habit = Habit(
            id=str(uuid.uuid4()),
            user_id=payload.user_id,
            habit_name=payload.habit_name,
            unit=payload.unit,
            current_level=payload.current_level,
            target_level=payload.target_level,
            trigger=payload.trigger,
            motivation=payload.motivation,
            ai_plan=payload.ai_plan,
        )
        db.add(habit)
        db.commit()
        db.refresh(habit)
        return habit

    def get_by_id(self, db: Session, habit_id: str) -> Habit:
        """Fetch a single habit by its ID."""
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
        if not habit:
            raise NotFoundError("Habit")
        return habit

    def get_by_user_id(self, db: Session, user_id: str) -> list[Habit]:
        """Fetch all habits for a specific user. Verify user exists first."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundError("User")
        return db.query(Habit).filter(Habit.user_id == user_id).all()
