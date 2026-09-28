from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ==========================================
# Health Schemas
# ==========================================
class HealthResponse(BaseModel):
    status: str
    service: str
    provider: str
    timestamp: datetime
    version: str = "1.0.0"

# ==========================================
# Task Parsing Schemas
# ==========================================
class ParseTaskRequest(BaseModel):
    natural_language_input: str = Field(..., description="User's prompt like 'Prep Q3 board deck tomorrow at 2pm for 90m'")
    current_time: Optional[datetime] = Field(default_factory=datetime.utcnow)
    timezone: Optional[str] = "UTC"

class ParsedTaskResult(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = Field("MEDIUM", description="LOW | MEDIUM | HIGH | URGENT")
    estimated_minutes: int = 30
    tags: List[str] = []
    category_suggestion: Optional[str] = None
    confidence_score: float = Field(0.95, ge=0.0, le=1.0)

# ==========================================
# Priority Scoring Schemas
# ==========================================
class TaskPriorityScoreRequest(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    estimated_minutes: int = 30
    user_active_task_count: int = 5
    is_urgent_user_flag: bool = False

class TaskPriorityScoreResult(BaseModel):
    ai_priority_score: float = Field(..., ge=0.0, le=10.0, description="Priority score from 0 to 10")
    recommended_priority: str
    eisenhower_quadrant: str # "Do First", "Schedule", "Delegate", "Don't Do"
    reasoning: str

# ==========================================
# Note Summarization Schemas
# ==========================================
class SummarizeNoteRequest(BaseModel):
    title: str
    content: str

class SummarizeNoteResult(BaseModel):
    summary: str
    key_takeaways: List[str]
    suggested_action_items: List[str]
    suggested_tags: List[str]

# ==========================================
# Daily Planner Schemas
# ==========================================
class DailyPlannerRequest(BaseModel):
    user_id: str
    date: str
    tasks: List[Dict[str, Any]]
    work_hour_start: int = 9
    work_hour_end: int = 17
    energy_peak: Optional[str] = "morning" # "morning", "afternoon", "evening"

class TimeBlock(BaseModel):
    start_time: str
    end_time: str
    task_id: Optional[str] = None
    label: str
    activity_type: str # "focus_work", "meeting", "break", "review"
    color: Optional[str] = None

class DailyPlannerResult(BaseModel):
    plan_date: str
    optimized_schedule: List[TimeBlock]
    daily_focus_theme: str
    ai_tips: List[str]
    estimated_productivity_score: float

# ==========================================
# Assistant Chat Schemas
# ==========================================
class ChatContext(BaseModel):
    active_tasks: Optional[List[Dict[str, Any]]] = []
    recent_notes: Optional[List[Dict[str, Any]]] = []
    daily_goals: Optional[List[str]] = []

class ChatMessageRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []
    context: Optional[ChatContext] = None

class ChatMessageResponse(BaseModel):
    response: str
    suggested_actions: Optional[List[Dict[str, Any]]] = []
    references: Optional[List[Dict[str, Any]]] = []

# ==========================================
# Semantic Search Schemas
# ==========================================
class SemanticSearchRequest(BaseModel):
    query: str
    entity_types: Optional[List[str]] = ["task", "note"]
    top_k: int = 5

class SearchResultItem(BaseModel):
    entity_id: str
    entity_type: str
    title: str
    snippet: str
    similarity_score: float
