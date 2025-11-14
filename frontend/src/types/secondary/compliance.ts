export interface ComplianceStandard {
  name: string;
  status: 'compliant' | 'non-compliant' | 'in-progress';
  last_audit: string;
  requirements: number;
  met: number;
}

export interface RegulatoryCheck {
  requirement: string;
  standard: string;
  status: 'compliant' | 'non-compliant';
  last_verified: string;
}

export interface InsuranceReport {
  id: string;
  type: string;
  period: string;
  generated: string;
  status: 'ready' | 'generating' | 'failed';
  size: string;
}

export interface EvidencePackage {
  id: string;
  name: string;
  description: string;
  format: string;
  generated_at: string;
  download_url?: string;
}