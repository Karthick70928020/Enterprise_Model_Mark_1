import hashlib
import base64
from typing import Optional

def generate_hash(data: str, algorithm: str = "sha256") -> str:
    """Generate hash of data using specified algorithm"""
    if algorithm == "sha256":
        return hashlib.sha256(data.encode()).hexdigest()
    elif algorithm == "sha512":
        return hashlib.sha512(data.encode()).hexdigest()
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")

def validate_hash(data: str, expected_hash: str, algorithm: str = "sha256") -> bool:
    """Validate data against expected hash"""
    return generate_hash(data, algorithm) == expected_hash

def base64_encode(data: str) -> str:
    """Base64 encode data"""
    return base64.b64encode(data.encode()).decode()

def base64_decode(encoded_data: str) -> str:
    """Base64 decode data"""
    return base64.b64decode(encoded_data.encode()).decode() 