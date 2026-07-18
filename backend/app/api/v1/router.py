from fastapi import APIRouter

from app.api.v1.endpoints import health, users, habits, checkins, urges

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(habits.router, prefix="/habits", tags=["Habits"])
api_router.include_router(checkins.router, prefix="/checkins", tags=["Check-ins"])
api_router.include_router(urges.router, prefix="/urges", tags=["Urges"])
