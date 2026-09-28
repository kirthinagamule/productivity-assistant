import logging
import sys
from app.core.config import settings

def setup_logger():
    logger = logging.getLogger("ai_service")
    logger.setLevel(settings.LOG_LEVEL.upper())
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt="%(asctime)s [%(levelname)s] (%(name)s): %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

logger = setup_logger()
