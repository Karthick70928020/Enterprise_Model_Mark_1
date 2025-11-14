import re
import ipaddress
from typing import Optional, Union
from datetime import datetime

def validate_hash_format(hash_string: str, algorithm: str = "sha256") -> bool:
    """Validate hash string format"""
    if algorithm == "sha256":
        return bool(re.match(r'^[a-f0-9]{64}$', hash_string, re.IGNORECASE))
    elif algorithm == "sha512":
        return bool(re.match(r'^[a-f0-9]{128}$', hash_string, re.IGNORECASE))
    else:
        return False

def validate_timestamp(timestamp: str) -> bool:
    """Validate ISO timestamp format"""
    try:
        datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        return True
    except ValueError:
        return False

def validate_device_id(device_id: str) -> bool:
    """Validate device ID format"""
    pattern = r'^[a-zA-Z0-9_-]{1,50}$'
    return bool(re.match(pattern, device_id))

def validate_totp_code(code: str) -> bool:
    """Validate TOTP code format"""
    return bool(re.match(r'^\d{6}$', code))

def validate_public_key_format(public_key: str) -> bool:
    """Validate public key format"""
    # Basic validation for PEM format
    return public_key.startswith('-----BEGIN PUBLIC KEY-----') and \
           public_key.endswith('-----END PUBLIC KEY-----')

def validate_signature_format(signature: str) -> bool:
    """Validate signature format (base64)"""
    try:
        # Check if it's valid base64
        import base64
        base64.b64decode(signature)
        return True
    except Exception:
        return False

def validate_compliance_framework(framework: str) -> bool:
    """Validate compliance framework identifier"""
    valid_frameworks = ['nist_800_53', 'iso_27001', 'hipaa', 'pci_dss', 'soc_2']
    return framework in valid_frameworks

def validate_alert_severity(severity: str) -> bool:
    """Validate alert severity level"""
    valid_severities = ['low', 'medium', 'high', 'critical']
    return severity in valid_severities

def sanitize_input(input_str: str, max_length: int = 1000) -> str:
    """Sanitize input string"""
    if not input_str:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\'&;]', '', input_str)
    
    # Truncate to max length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()