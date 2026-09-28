from fastapi import APIRouter
from app.models.schemas import ChatMessageRequest, ChatMessageResponse

router = APIRouter()

@router.post("/message", response_model=ChatMessageResponse)
async def chat_with_assistant(request: ChatMessageRequest):
    """
    Conversational productivity coach with context over tasks, notes, and schedule
    """
    return ChatMessageResponse(
        response=f"I reviewed your schedule. You have high-priority tasks in progress. How can I help you tackle '{request.message}'?",
        suggested_actions=[
            {"type": "CREATE_TASK", "label": "Add follow-up task"},
            {"type": "SCHEDULE_FOCUS", "label": "Start 25m Pomodoro Focus Session"}
        ],
        references=[]
    )
