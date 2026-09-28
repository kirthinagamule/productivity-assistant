from fastapi import APIRouter
from datetime import datetime
from app.models.schemas import HealthResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def get_health():
    return HealthResponse(
        status="healthy",
        service="ai-productivity-service",
        provider=settings.LLM_PROVIDER,
        timestamp=datetime.utcnow(),
        version="1.0.0"
    )
