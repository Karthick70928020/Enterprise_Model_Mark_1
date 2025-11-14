from datetime import datetime, timedelta
from typing import Dict, Any, List

class ComplianceChecker:
    def __init__(self):
        self.compliance_rules = self._initialize_compliance_rules()
        
    def _initialize_compliance_rules(self) -> Dict[str, Any]:
        """Initialize compliance checking rules"""
        return {
            "retention_period": {
                "min_days": 90,
                "max_days": 3650,
                "description": "Audit log retention period"
            },
            "cryptographic_standards": {
                "min_key_size": 2048,
                "allowed_algorithms": ["RSA-PSS-SHA256", "ECDSA-P256"],
                "description": "Cryptographic algorithm requirements"
            },
            "access_control": {
                "mfa_required": True,
                "session_timeout": 3600,
                "description": "Access control requirements"
            },
            "integrity_verification": {
                "hash_algorithm": "SHA-256",
                "signature_required": True,
                "description": "Data integrity requirements"
            }
        }
    
    async def check_system_compliance(self, system_state: Dict[str, Any]) -> Dict[str, Any]:
        """Check system compliance with all rules"""
        results = {}
        
        # Check retention period
        results["retention_period"] = await self._check_retention_period(
            system_state.get("audit_retention_days", 0)
        )
        
        # Check cryptographic standards
        results["cryptographic_standards"] = await self._check_crypto_standards(
            system_state.get("crypto_config", {})
        )
        
        # Check access control
        results["access_control"] = await self._check_access_control(
            system_state.get("access_config", {})
        )
        
        # Check integrity verification
        results["integrity_verification"] = await self._check_integrity_verification(
            system_state.get("integrity_config", {})
        )
        
        # Calculate overall compliance
        compliant_rules = sum(1 for result in results.values() if result["compliant"])
        total_rules = len(results)
        overall_compliance = compliant_rules / total_rules if total_rules > 0 else 0
        
        return {
            "overall_compliance": round(overall_compliance, 3),
            "compliant_rules": compliant_rules,
            "total_rules": total_rules,
            "status": "compliant" if overall_compliance >= 0.9 else "non_compliant",
            "detailed_results": results,
            "checked_at": datetime.utcnow().isoformat()
        }
    
    async def _check_retention_period(self, retention_days: int) -> Dict[str, Any]:
        """Check retention period compliance"""
        min_days = self.compliance_rules["retention_period"]["min_days"]
        max_days = self.compliance_rules["retention_period"]["max_days"]
        
        compliant = min_days <= retention_days <= max_days
        
        return {
            "compliant": compliant,
            "current_value": retention_days,
            "required_range": f"{min_days}-{max_days} days",
            "description": self.compliance_rules["retention_period"]["description"]
        }
    
    async def _check_crypto_standards(self, crypto_config: Dict[str, Any]) -> Dict[str, Any]:
        """Check cryptographic standards compliance"""
        key_size = crypto_config.get("key_size", 0)
        algorithm = crypto_config.get("algorithm", "")
        
        min_key_size = self.compliance_rules["cryptographic_standards"]["min_key_size"]
        allowed_algorithms = self.compliance_rules["cryptographic_standards"]["allowed_algorithms"]
        
        key_compliant = key_size >= min_key_size
        algorithm_compliant = algorithm in allowed_algorithms
        
        return {
            "compliant": key_compliant and algorithm_compliant,
            "key_size_compliant": key_compliant,
            "algorithm_compliant": algorithm_compliant,
            "current_key_size": key_size,
            "current_algorithm": algorithm,
            "required_key_size": f">= {min_key_size}",
            "allowed_algorithms": allowed_algorithms,
            "description": self.compliance_rules["cryptographic_standards"]["description"]
        }
    
    async def _check_access_control(self, access_config: Dict[str, Any]) -> Dict[str, Any]:
        """Check access control compliance"""
        mfa_enabled = access_config.get("mfa_enabled", False)
        session_timeout = access_config.get("session_timeout", 0)
        
        required_timeout = self.compliance_rules["access_control"]["session_timeout"]
        
        mfa_compliant = mfa_enabled
        timeout_compliant = session_timeout <= required_timeout
        
        return {
            "compliant": mfa_compliant and timeout_compliant,
            "mfa_compliant": mfa_compliant,
            "timeout_compliant": timeout_compliant,
            "current_mfa": mfa_enabled,
            "current_timeout": session_timeout,
            "required_timeout": f"<= {required_timeout} seconds",
            "description": self.compliance_rules["access_control"]["description"]
        }
    
    async def _check_integrity_verification(self, integrity_config: Dict[str, Any]) -> Dict[str, Any]:
        """Check integrity verification compliance"""
        hash_algorithm = integrity_config.get("hash_algorithm", "")
        signature_required = integrity_config.get("signature_required", False)
        
        required_algorithm = self.compliance_rules["integrity_verification"]["hash_algorithm"]
        required_signature = self.compliance_rules["integrity_verification"]["signature_required"]
        
        algorithm_compliant = hash_algorithm == required_algorithm
        signature_compliant = signature_required == required_signature
        
        return {
            "compliant": algorithm_compliant and signature_compliant,
            "algorithm_compliant": algorithm_compliant,
            "signature_compliant": signature_compliant,
            "current_algorithm": hash_algorithm,
            "current_signature": signature_required,
            "required_algorithm": required_algorithm,
            "required_signature": required_signature,
            "description": self.compliance_rules["integrity_verification"]["description"]
        }
    
    async def generate_compliance_report(self, system_state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed compliance report"""
        compliance_check = await self.check_system_compliance(system_state)
        
        return {
            "report_id": f"comp_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            "generated_at": datetime.utcnow().isoformat(),
            "system_state": system_state,
            "compliance_results": compliance_check,
            "compliance_rules": self.compliance_rules,
            "recommendations": self._generate_recommendations(compliance_check)
        }
    
    def _generate_recommendations(self, compliance_check: Dict[str, Any]) -> List[str]:
        """Generate compliance recommendations"""
        recommendations = []
        
        for rule_name, result in compliance_check["detailed_results"].items():
            if not result["compliant"]:
                recommendations.append(f"Address non-compliance in {rule_name}: {result['description']}")
        
        if compliance_check["overall_compliance"] < 0.9:
            recommendations.append("Implement immediate corrective actions to improve overall compliance")
        
        return recommendations