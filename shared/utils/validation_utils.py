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

def validate_mac_address(mac: str) -> bool:
    """Validate MAC address format"""
    pattern = r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'
    return bool(re.match(pattern, mac))

def validate_port(port: Union[str, int]) -> bool:
    """Validate port number"""
    try:
        port_num = int(port)
        return 1 <= port_num <= 65535
    except (ValueError, TypeError):
        return False

def sanitize_input(input_str: str) -> str:
    """Basic input sanitization"""
    return input_str.strip()