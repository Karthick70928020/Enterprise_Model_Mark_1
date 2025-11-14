import asyncio
from datetime import datetime
from typing import Dict, Any, List, Set, Optional
from enum import Enum

class RuleAction(Enum):
    ALLOW = "allow"
    BLOCK = "block"
    LOG = "log"

class FirewallManager:
    def __init__(self):
        self.rules = self._initialize_default_rules()
        self.rule_log = []
        
    def _initialize_default_rules(self) -> List[Dict[str, Any]]:
        """Initialize default firewall rules"""
        return [
            {
                "id": "rule_001",
                "name": "Block Known Malicious IPs",
                "action": RuleAction.BLOCK.value,
                "priority": 100,
                "condition": {
                    "type": "ip_blocklist",
                    "values": ["10.0.0.100", "192.168.1.200"]
                },
                "enabled": True
            },
            {
                "id": "rule_002", 
                "name": "Allow HTTP/HTTPS Outbound",
                "action": RuleAction.ALLOW.value,
                "priority": 50,
                "condition": {
                    "type": "protocol",
                    "values": ["HTTP", "HTTPS"]
                },
                "enabled": True
            },
            {
                "id": "rule_003",
                "name": "Block Suspicious Ports",
                "action": RuleAction.BLOCK.value,
                "priority": 80,
                "condition": {
                    "type": "port_blocklist", 
                    "values": [23, 135, 445, 1433, 3389]
                },
                "enabled": True
            }
        ]
    
    async def evaluate_packet(self, packet_data: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate packet against firewall rules"""
        decision = RuleAction.ALLOW.value  # Default allow
        matched_rule = None
        
        # Sort rules by priority (descending)
        sorted_rules = sorted(self.rules, key=lambda x: x["priority"], reverse=True)
        
        for rule in sorted_rules:
            if not rule["enabled"]:
                continue
                
            if await self._check_condition(rule["condition"], packet_data):
                decision = rule["action"]
                matched_rule = rule
                break  # First match wins
        
        # Log the decision
        log_entry = await self._log_decision(packet_data, decision, matched_rule)
        
        return {
            "decision": decision,
            "matched_rule": matched_rule["id"] if matched_rule else None,
            "timestamp": datetime.utcnow().isoformat(),
            "log_id": log_entry["log_id"]
        }
    
    async def _check_condition(self, condition: Dict[str, Any], packet_data: Dict[str, Any]) -> bool:
        """Check if packet matches rule condition"""
        condition_type = condition["type"]
        values = condition["values"]
        
        if condition_type == "ip_blocklist":
            return packet_data.get("source") in values or packet_data.get("destination") in values
        
        elif condition_type == "protocol":
            return packet_data.get("protocol") in values
        
        elif condition_type == "port_blocklist":
            # Simulate port extraction
            return False  # Simplified for demo
        
        return False
    
    async def _log_decision(self, packet_data: Dict[str, Any], decision: str, rule: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Log firewall decision"""
        log_entry = {
            "log_id": f"fw_log_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.utcnow().isoformat(),
            "source_ip": packet_data.get("source"),
            "destination_ip": packet_data.get("destination"), 
            "protocol": packet_data.get("protocol"),
            "decision": decision,
            "matched_rule": rule["id"] if rule else None,
            "packet_size": packet_data.get("size")
        }
        
        self.rule_log.append(log_entry)
        
        # Keep only last 1000 entries
        if len(self.rule_log) > 1000:
            self.rule_log = self.rule_log[-1000:]
        
        return log_entry
    
    async def add_rule(self, rule: Dict[str, Any]) -> str:
        """Add new firewall rule"""
        rule_id = f"rule_{len(self.rules) + 1:03d}"
        rule["id"] = rule_id
        self.rules.append(rule)
        return rule_id
    
    async def enable_rule(self, rule_id: str) -> bool:
        """Enable a firewall rule"""
        for rule in self.rules:
            if rule["id"] == rule_id:
                rule["enabled"] = True
                return True
        return False
    
    async def disable_rule(self, rule_id: str) -> bool:
        """Disable a firewall rule"""
        for rule in self.rules:
            if rule["id"] == rule_id:
                rule["enabled"] = False
                return True
        return False
    
    def get_rules(self) -> List[Dict[str, Any]]:
        """Get all firewall rules"""
        return self.rules.copy()
    
    def get_rule_log(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent firewall log entries"""
        return self.rule_log[-limit:] if self.rule_log else []