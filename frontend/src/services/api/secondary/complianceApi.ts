import axios from 'axios';

const COMPLIANCE_API_BASE = 'http://localhost:8001/api/v1/compliance';

const complianceApi = axios.create({
  baseURL: COMPLIANCE_API_BASE,
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer demo-token-2024'
  }
});

export const complianceApiService = {
  // Compliance dashboard
  getComplianceStatus: async () => {
    const response = await complianceApi.get('/status');
    return response.data;
  },

  // Regulatory checks
  runRegulatoryCheck: async (standard: string) => {
    const response = await complianceApi.post('/checks/run', { standard });
    return response.data;
  },

  getRegulatoryResults: async (standard?: string) => {
    const params = new URLSearchParams();
    if (standard) params.append('standard', standard);
    
    const response = await complianceApi.get(`/checks/results?${params.toString()}`);
    return response.data;
  },

  // Insurance reports
  generateInsuranceReport: async (period: string) => {
    const response = await complianceApi.post('/insurance/report', { period });
    return response.data;
  },

  getInsuranceReports: async () => {
    const response = await complianceApi.get('/insurance/reports');
    return response.data;
  },

  // Evidence generation
  generateEvidence: async (requirements: any) => {
    const response = await complianceApi.post('/evidence/generate', requirements);
    return response.data;
  },

  getEvidencePackages: async () => {
    const response = await complianceApi.get('/evidence/packages');
    return response.data;
  },

  // Standards compliance
  getSupportedStandards: async () => {
    const response = await complianceApi.get('/standards');
    return response.data;
  },

  checkStandardCompliance: async (standard: string) => {
    const response = await complianceApi.get(`/standards/${standard}/compliance`);
    return response.data;
  }
};

export default complianceApiService;