export interface AuditTrailStatus {
  block_count: number;
  integrity_verified: boolean;
  first_block_time: string | null;
  last_block_time: string | null;
  current_chain_hash: string;
}

export interface AuditBlock {
  block_type: string;
  timestamp: string;
  previous_hash: string;
  block_hash: string;
  data: any;
  signature_info: any;
}

export interface IntegrityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  last_check: string;
}

export interface ForensicEvidence {
  id: string;
  type: string;
  timestamp: string;
  severity: string;
  description: string;
  evidence: Record<string, any>;
}