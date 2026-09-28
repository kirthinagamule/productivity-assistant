from fastapi import APIRouter
from typing import List
from app.models.schemas import SemanticSearchRequest, SearchResultItem
from app.services.embeddings import embedding_service

router = APIRouter()

@router.post("/semantic", response_model=List[SearchResultItem])
async def semantic_search(request: SemanticSearchRequest):
    """
    Computes query embedding and retrieves closest tasks/notes via pgvector
    """
    _ = await embedding_service.get_embedding(request.query)

    # Stub search results
    return [
        SearchResultItem(
            entity_id="task-101",
            entity_type="task",
            title="Benchmark pgvector similarity search performance",
            snippet="High priority AI research benchmark for PostgreSQL vector index.",
            similarity_score=0.92
        ),
        SearchResultItem(
            entity_id="note-201",
            entity_type="note",
            title="Productivity Assistant Architecture RFC",
            snippet="Full-stack AI assistant technical architecture and data flow.",
            similarity_score=0.88
        )
    ]
