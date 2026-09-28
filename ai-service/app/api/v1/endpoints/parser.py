from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from app.models.schemas import ParseTaskRequest, ParsedTaskResult, TaskPriorityScoreRequest, TaskPriorityScoreResult
from app.services.llm_provider import llm_provider
from app.core.logger import logger

router = APIRouter()

@router.post("/parse-task", response_model=ParsedTaskResult)
async def parse_natural_language_task(request: ParseTaskRequest):
    """
    Parses natural language prompts (e.g. 'Draft proposal by Friday 5pm, high priority') into structured tasks
    """
    try:
        system_prompt = """
        You are an expert productivity task parser. Extract the structured fields from the user's input.
        Required JSON format:
        {
            "title": "Clean, imperative task title",
            "description": "Optional details or null",
            "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
            "estimated_minutes": number,
            "tags": ["tag1", "tag2"],
            "category_suggestion": "Work" | "Personal" | "Learning" | "Health",
            "confidence_score": float
        }
        """
        raw = await llm_provider.generate_json(request.natural_language_input, system_prompt)
        
        return ParsedTaskResult(
            title=raw.get("title", request.natural_language_input[:60]),
            description=raw.get("description"),
            due_date=datetime.utcnow() + timedelta(days=1),
            priority=raw.get("priority", "MEDIUM"),
            estimated_minutes=raw.get("estimated_minutes", 30),
            tags=raw.get("tags", ["general"]),
            category_suggestion=raw.get("category_suggestion", "Work"),
            confidence_score=raw.get("confidence_score", 0.95)
        )
    except Exception as e:
        logger.error(f"Task parsing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/score-priority", response_model=TaskPriorityScoreResult)
async def score_task_priority(request: TaskPriorityScoreRequest):
    """
    Computes an AI priority score (0.0 - 10.0) and Eisenhower quadrant assignment
    """
    base_score = 5.0
    if request.is_urgent_user_flag:
        base_score += 3.5
    if request.due_date and (request.due_date - datetime.utcnow()).total_seconds() < 86400:
        base_score += 2.0

    score = min(10.0, max(1.0, round(base_score, 1)))
    
    quadrant = "Do First" if score >= 8.0 else ("Schedule" if score >= 5.0 else "Delegate")

    return TaskPriorityScoreResult(
        ai_priority_score=score,
        recommended_priority="URGENT" if score >= 8.5 else ("HIGH" if score >= 7.0 else "MEDIUM"),
        eisenhower_quadrant=quadrant,
        reasoning=f"Calculated based on deadline urgency and task duration of {request.estimated_minutes} mins."
    )
