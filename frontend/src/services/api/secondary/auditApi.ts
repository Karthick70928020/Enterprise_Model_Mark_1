import axios from 'axios';

const AUDIT_API_BASE = 'http://localhost:8001/api/v1/audit';

const auditApi = axios.create({
  baseURL: AUDIT_API_BASE,
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer demo-token-2024'
  }
});

export const auditApiService = {
  // Audit trail
  getAuditTrail: async (startDate?: string, endDate?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (limit) params.append('limit', limit.toString());
    
    const response = await auditApi.get(`/trail?${params.toString()}`);
    return response.data;
  },

  // Integrity verification
  verifyIntegrity: async () => {
    const response = await auditApi.post('/verify');
    return response.data;
  },

  // Log verification
  verifyLog: async (logId: string) => {
    const response = await auditApi.get(`/verify/${logId}`);
    return response.data;
  },

  // Forensic evidence
  getForensicEvidence: async (incidentId: string) => {
    const response = await auditApi.get(`/forensic/${incidentId}`);
    return response.data;
  },

  generateEvidenceReport: async (criteria: any) => {
    const response = await auditApi.post('/forensic/report', criteria);
    return response.data;
  },

  // Statistics
  getAuditStats: async () => {
    const response = await auditApi.get('/stats');
    return response.data;
  },

  // Export
  exportAuditTrail: async (format: 'json' | 'csv' | 'pdf', criteria?: any) => {
    const response = await auditApi.post('/export', { format, ...criteria });
    return response.data;
  }
};

export default auditApiService;