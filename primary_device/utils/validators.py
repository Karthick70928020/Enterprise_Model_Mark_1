import ipaddress
import re
from typing import Optional, Union

def validate_ip_address(ip: str) -> bool:
    """Validate IP address format"""
    try:
        ipaddress.ip_address(ip)
        return True
    except ValueError:
        return False

def validate_port(port: Union[str, int]) -> bool:
    """Validate port number"""
    try:
        port_num = int(port)
        return 1 <= port_num <= 65535
    except (ValueError, TypeError):
        return False

def validate_mac_address(mac: str) -> bool:
    """Validate MAC address format"""
    pattern = r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'
    return bool(re.match(pattern, mac))

def validate_url(url: str) -> bool:
    """Validate URL format"""
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return bool(re.match(pattern, url, re.IGNORECASE))

def sanitize_input(input_str: str, max_length: int = 1000) -> str:
    """Sanitize input string"""
    if not input_str:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\'&]', '', input_str)
    
    # Truncate to max length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()

def validate_json_schema(data: dict, required_fields: list) -> bool:
    """Validate JSON data against required fields"""
    if not isinstance(data, dict):
        return False
    
    for field in required_fields:
        if field not in data:
            return False
    
    return True