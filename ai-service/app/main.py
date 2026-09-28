from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.logger import logger
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} in [{settings.ENVIRONMENT}] mode")
    logger.info(f"LLM Provider configured: {settings.LLM_PROVIDER}")
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Python FastAPI Microservice for AI Task Parsing, Daily Planning, Semantic Search, and Prioritization",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
async def root_health():
    return {
        "status": "healthy",
        "service": "ai-service",
        "provider": settings.LLM_PROVIDER,
        "environment": settings.ENVIRONMENT
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "AI Productivity Assistant Microservice API is running",
        "docs_url": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
