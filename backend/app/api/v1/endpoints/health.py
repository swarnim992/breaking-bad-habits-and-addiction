from fastapi import APIRouter

router = APIRouter()


@router.get("", summary="Health check")
async def health_check():
    """Returns server status. Used by load balancers and monitoring tools."""
    return {"status": "ok", "service": "PromptWar API"}
