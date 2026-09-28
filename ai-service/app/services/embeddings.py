import numpy as np
from typing import List
from app.core.config import settings
from app.core.logger import logger

class EmbeddingService:
    """
    Embedding service generating 768-dimensional vectors for PostgreSQL pgvector
    """

    def __init__(self):
        self.dimension = 768
        logger.info(f"Embedding Service initialized (Dimension: {self.dimension})")

    async def get_embedding(self, text: str) -> List[float]:
        """
        Generate embedding vector for a given text snippet
        """
        if not text or not text.strip():
            return [0.0] * self.dimension

        if settings.LLM_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                result = genai.embed_content(
                    model="models/text-embedding-004",
                    content=text,
                    task_type="retrieval_document"
                )
                return result['embedding']
            except Exception as e:
                logger.warning(f"Gemini embedding failed: {e}. Using deterministic local embedding.")

        # Deterministic normalized embedding fallback using hashing for offline/dev consistency
        return self._generate_deterministic_vector(text)

    def _generate_deterministic_vector(self, text: str) -> List[float]:
        """
        Generates a consistent 768-dim normalized pseudo-embedding based on text hash
        """
        seed = abs(hash(text)) % (2**32)
        rng = np.random.default_rng(seed)
        vec = rng.standard_normal(self.dimension)
        # L2 normalize
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

embedding_service = EmbeddingService()
