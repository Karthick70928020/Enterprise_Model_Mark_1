import logging
import sys
from datetime import datetime

def setup_secure_logger(name: str, level=logging.INFO) -> logging.Logger:
    """Setup secure structured logger for secondary device"""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Create secure formatter (no sensitive data in production)
    formatter = logging.Formatter(
        '%(asctime)s - SECURE - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler for audit purposes
    file_handler = logging.FileHandler('secondary_device_secure.log')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    return logger