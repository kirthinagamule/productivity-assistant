from fastapi import APIRouter
from app.api.v1.endpoints import health, parser, planner, search, chat

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(parser.router, prefix="/parser", tags=["Task Parser & Priority"])
api_router.include_router(planner.router, prefix="/planner", tags=["Daily Planner"])
api_router.include_router(search.router, prefix="/search", tags=["Semantic Search"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI Assistant Chat"])
