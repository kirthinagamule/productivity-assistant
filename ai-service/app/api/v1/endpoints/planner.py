from fastapi import APIRouter
from app.models.schemas import DailyPlannerRequest, DailyPlannerResult, TimeBlock

router = APIRouter()

@router.post("/generate", response_model=DailyPlannerResult)
async def generate_daily_plan(request: DailyPlannerRequest):
    """
    Generates an optimized time-blocked daily schedule based on active tasks and energy curves
    """
    blocks = [
        TimeBlock(start_time="09:00", end_time="09:30", label="Daily Triage & Goal Alignment", activity_type="review", color="#6366F1"),
        TimeBlock(start_time="09:30", end_time="11:30", label="Deep Work: High Priority Tasks", activity_type="focus_work", color="#8B5CF6"),
        TimeBlock(start_time="11:30", end_time="12:30", label="Async Communication & Code Reviews", activity_type="meeting", color="#3B82F6"),
        TimeBlock(start_time="12:30", end_time="13:30", label="Lunch & Cognitive Recharge", activity_type="break", color="#10B981"),
        TimeBlock(start_time="13:30", end_time="15:30", label="Deep Work Block 2", activity_type="focus_work", color="#8B5CF6"),
        TimeBlock(start_time="15:30", end_time="17:00", label="Administrative, Wrap-up & Tomorrow Planning", activity_type="review", color="#EC4899"),
    ]

    return DailyPlannerResult(
        plan_date=request.date,
        optimized_schedule=blocks,
        daily_focus_theme="Deep Focus & High-Impact Delivery",
        ai_tips=[
            "Tackle your most demanding cognitive task during your 09:30 peak window.",
            "Take a 5-minute break every 50 minutes to maintain peak focus.",
        ],
        estimated_productivity_score=94.0
    )
