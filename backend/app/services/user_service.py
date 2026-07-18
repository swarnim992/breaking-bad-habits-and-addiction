import uuid
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.user import User
from app.schemas.user import UserCreate


class UserService:
    def get_all(self, db: Session) -> list[User]:
        """Return all users."""
        return db.query(User).all()

    def create_user(self, db: Session, payload: UserCreate) -> User:
        """Create a new user. If payload.id is provided, check for conflicts."""
        user_id = payload.id or str(uuid.uuid4())
        
        # Check if user already exists
        existing = db.query(User).filter(User.id == user_id).first()
        if existing:
            raise ConflictError(f"User with ID '{user_id}' already exists")

        user = User(id=user_id)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_by_id(self, db: Session, user_id: str) -> User:
        """Fetch a user by ID. Raises NotFoundError if missing."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundError("User")
        return user
