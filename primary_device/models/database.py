from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class ThreatEvent(Base):
    __tablename__ = "threat_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    threat_level = Column(String)
    threat_type = Column(String)
    source_ip = Column(String)
    destination_ip = Column(String)
    protocol = Column(String)
    description = Column(String)
    evidence = Column(JSON)
    blocked = Column(Boolean, default=False)
    
class NetworkPacket(Base):
    __tablename__ = "network_packets"
    
    id = Column(Integer, primary_key=True, index=True)
    packet_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source_ip = Column(String)
    destination_ip = Column(String)
    protocol = Column(String)
    size = Column(Integer)
    flags = Column(Integer)
    risk_score = Column(Float)
    analyzed = Column(Boolean, default=False)

class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    log_level = Column(String)
    component = Column(String)
    message = Column(String)
    metadata = Column(JSON)

class AIModel(Base):
    __tablename__ = "ai_models"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, unique=True, index=True)
    model_type = Column(String)
    version = Column(String)
    accuracy = Column(Float)
    last_trained = Column(DateTime)
    is_active = Column(Boolean, default=True)
    parameters = Column(JSON)