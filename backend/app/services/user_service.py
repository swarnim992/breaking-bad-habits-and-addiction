"""
UserService — simple in-memory skeleton.
Replace with real DB calls when you add a database.
"""

import uuid
from typing import Optional

from app.core.exceptions import ConflictError, NotFoundError
from app.schemas.user import UserCreate, UserResponse


class UserService:
    # In-memory store (replace with DB repository later)
    _store: dict[str, dict] = {}

    def get_all(self) -> list[UserResponse]:
        """Return all users."""
        return [
            UserResponse(id=u["id"], username=u["username"], email=u["email"])
            for u in self._store.values()
        ]

    def create_user(self, payload: UserCreate) -> UserResponse:
        """Create a new user. Raises ConflictError if username already taken."""
        if self._find_by_username(payload.username):
            raise ConflictError(f"Username '{payload.username}' is already taken")

        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "username": payload.username,
            "email": payload.email,
        }
        self._store[user_id] = user
        return UserResponse(**user)

    def get_by_id(self, user_id: str) -> UserResponse:
        """Fetch a user by ID. Raises NotFoundError if missing."""
        user = self._store.get(user_id)
        if not user:
            raise NotFoundError("User")
        return UserResponse(**user)

    def _find_by_username(self, username: str) -> Optional[dict]:
        return next(
            (u for u in self._store.values() if u["username"] == username), None
        )
