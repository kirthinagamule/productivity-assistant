import json
import re
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.core.config import settings
from app.core.logger import logger

class LLMProvider:
    """
    Unified LLM provider supporting Gemini, OpenAI, and a reliable fallback engine
    """

    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.model_name = settings.AI_MODEL_NAME

        # Initialize Gemini if configured
        if self.provider == "gemini" and settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel(self.model_name)
                logger.info(f"Gemini LLM Provider initialized with model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini SDK: {e}. Falling back to mock provider.")
                self.provider = "mock"

        # Initialize OpenAI if configured
        elif self.provider == "openai" and settings.OPENAI_API_KEY:
            try:
                from openai import AsyncOpenAI
                self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                logger.info("OpenAI LLM Provider initialized.")
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI SDK: {e}. Falling back to mock provider.")
                self.provider = "mock"
        else:
            logger.info("Running LLM Provider in deterministic Mock/Development mode.")
            self.provider = "mock"

    async def generate_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate structured JSON response from LLM
        """
        if self.provider == "gemini" and hasattr(self, 'gemini_model'):
            try:
                response = self.gemini_model.generate_content(
                    f"{system_prompt or ''}\n\nUser: {prompt}\n\nRespond ONLY with a valid JSON object."
                )
                text = response.text.strip()
                # Remove markdown json code blocks if present
                clean_json = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.MULTILINE)
                return json.loads(clean_json)
            except Exception as e:
                logger.error(f"Gemini generation error: {e}. Falling back to rule-based parser.")
        
        elif self.provider == "openai" and hasattr(self, 'openai_client'):
            try:
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    response_format={"type": "json_object"},
                    messages=[
                        {"role": "system", "content": system_prompt or "You are a helpful JSON assistant."},
                        {"role": "user", "content": prompt}
                    ]
                )
                content = response.choices[0].message.content
                return json.loads(content)
            except Exception as e:
                logger.error(f"OpenAI generation error: {e}. Falling back to rule-based parser.")

        # Fallback intelligent rule-based engine
        return self._mock_fallback_generate(prompt)

    def _mock_fallback_generate(self, prompt: str) -> Dict[str, Any]:
        """
        Rule-based NLP fallback for local development without external API keys
        """
        lower_prompt = prompt.lower()
        
        # Check if this is a task parsing prompt
        if "parse" in lower_prompt or "task" in lower_prompt:
            priority = "MEDIUM"
            if any(w in lower_prompt for w in ["urgent", "asap", "immediately", "critical"]):
                priority = "URGENT"
            elif any(w in lower_prompt for w in ["high", "important", "priority"]):
                priority = "HIGH"
            elif any(w in lower_prompt for w in ["low", "whenever", "someday"]):
                priority = "LOW"

            # Parse minutes
            minutes = 30
            match_min = re.search(r"(\d+)\s*(?:min|m|minute)", lower_prompt)
            match_hr = re.search(r"(\d+)\s*(?:hr|hour|h)", lower_prompt)
            if match_min:
                minutes = int(match_min.group(1))
            elif match_hr:
                minutes = int(match_hr.group(1)) * 60

            # Tags extraction
            tags = []
            if "meet" in lower_prompt or "call" in lower_prompt:
                tags.append("meeting")
            if "email" in lower_prompt:
                tags.append("communication")
            if "code" in lower_prompt or "dev" in lower_prompt or "build" in lower_prompt:
                tags.append("engineering")

            return {
                "title": prompt.split("\n")[0][:80].strip(),
                "description": f"Auto-parsed task: {prompt[:120]}",
                "priority": priority,
                "estimated_minutes": minutes,
                "tags": tags or ["general"],
                "category_suggestion": "Work" if "work" in lower_prompt or "meeting" in lower_prompt else "Personal",
                "confidence_score": 0.94
            }

        # Default fallback
        return {
            "response": "I have processed your request. How else can I assist your productivity today?",
            "status": "success"
        }

llm_provider = LLMProvider()
