from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class AuditEvent(Base):
    __tablename__ = "audit_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String)
    user = Column(String)
    action = Column(String)
    resource = Column(String)
    status = Column(String)
    details = Column(JSON)
    ip_address = Column(String)
    user_agent = Column(String)
    signature_required = Column(Boolean, default=False)
    event_hash = Column(String)

class CryptographicKey(Base):
    __tablename__ = "cryptographic_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    key_id = Column(String, unique=True, index=True)
    key_type = Column(String)
    algorithm = Column(String)
    key_size = Column(Integer)
    public_key = Column(Text)
    private_key_encrypted = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
    key_usage = Column(JSON)

class AuditBlock(Base):
    __tablename__ = "audit_blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    block_hash = Column(String, unique=True, index=True)
    block_type = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    previous_hash = Column(String)
    data_hash = Column(String)
    log_data = Column(JSON)
    signature_info = Column(JSON)
    description = Column(Text)

class SecurityAlert(Base):
    __tablename__ = "security_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity = Column(String)
    title = Column(String)
    description = Column(Text)
    source = Column(String)
    metadata = Column(JSON)
    status = Column(String)
    acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime)
    resolved_at = Column(DateTime)