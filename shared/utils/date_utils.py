from datetime import datetime, timedelta
from typing import Optional

def get_utc_now() -> datetime:
    """Get current UTC datetime"""
    return datetime.utcnow()

def format_timestamp(dt: datetime) -> str:
    """Format datetime as ISO string"""
    return dt.isoformat()

def parse_timestamp(timestamp: str) -> datetime:
    """Parse ISO timestamp string to datetime"""
    return datetime.fromisoformat(timestamp.replace('Z', '+00:00'))

def get_time_difference(start: datetime, end: datetime) -> timedelta:
    """Calculate time difference between two datetimes"""
    return end - start