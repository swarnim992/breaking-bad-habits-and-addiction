from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.schemas.habit import HabitResponse
from app.services.ai_service import AiService
from app.services.habit_service import HabitService
from app.services.checkin_service import CheckInService
from app.services.urge_service import UrgeService

router = APIRouter()
habit_service = HabitService()
ai_service = AiService()
checkin_service = CheckInService()
urge_service = UrgeService()


class InsightsResponse(BaseModel):
    biggestTrigger: str
    pattern: str
    progressText: str
    recommendation: str
class PlanGenerateRequest(BaseModel):
    habit_id: str


@router.post("/generate-plan", response_model=HabitResponse, summary="Generate and save AI plan")
async def generate_plan(payload: PlanGenerateRequest, db: Session = Depends(get_db)):
    """
    Fetch a habit, pass details to the AI service to generate a personalized behavior-change plan,
    save the plan to the habit in the database, and return the updated habit.
    """
    # 1. Fetch the habit details
    habit = habit_service.get_by_id(db, payload.habit_id)

    # 2. Call AI Service to generate personalized plan
    ai_plan = ai_service.generate_personalized_plan(
        habit_name=habit.habit_name,
        unit=habit.unit or "units",
        current_level=habit.current_level,
        target_level=habit.target_level,
        trigger=habit.trigger,
        motivation=habit.motivation,
    )

    # 3. Save the generated plan to the database and return
    updated_habit = habit_service.update_habit_ai_plan(db, payload.habit_id, ai_plan)
    return updated_habit


@router.get("/insights/{habit_id}", response_model=InsightsResponse, summary="Get AI insights")
async def get_insights(habit_id: str, db: Session = Depends(get_db)):
    """
    Generate AI insights based on habit, check-ins, and urges history.
    """
    habit = habit_service.get_by_id(db, habit_id)
    checkins = checkin_service.get_by_habit_id(db, habit_id)
    urges = urge_service.get_by_habit_id(db, habit_id)

    insights_dict = ai_service.generate_insights(
        habit_name=habit.habit_name,
        unit=habit.unit or "units",
        target_level=habit.target_level,
        trigger=habit.trigger,
        motivation=habit.motivation,
        checkins=checkins,
        urges=urges
    )
    return InsightsResponse(**insights_dict)
