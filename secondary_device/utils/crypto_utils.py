import hashlib
import base64
from typing import Optional
import json

def generate_hash(data: str, algorithm: str = "sha256") -> str:
    """Generate hash of data using specified algorithm"""
    if algorithm == "sha256":
        return hashlib.sha256(data.encode()).hexdigest()
    elif algorithm == "sha512":
        return hashlib.sha512(data.encode()).hexdigest()
    elif algorithm == "sha3_256":
        return hashlib.sha3_256(data.encode()).hexdigest()
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

def generate_key_fingerprint(public_key: str) -> str:
    """Generate key fingerprint"""
    key_hash = hashlib.sha256(public_key.encode()).hexdigest()
    return f"key_{key_hash[:16]}"

def calculate_entropy(data: str) -> float:
    """Calculate entropy of data"""
    import math
    from collections import Counter
    
    if not data:
        return 0.0
    
    counter = Counter(data)
    entropy = 0.0
    total_len = len(data)
    
    for count in counter.values():
        p_x = count / total_len
        entropy += -p_x * math.log2(p_x)
    
    return entropy

def secure_compare(a: str, b: str) -> bool:
    """Constant-time string comparison to prevent timing attacks"""
    if len(a) != len(b):
        return False
    
    result = 0
    for x, y in zip(a, b):
        result |= ord(x) ^ ord(y)
    return result == 0