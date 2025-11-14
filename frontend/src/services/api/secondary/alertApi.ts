import axios from 'axios';

const ALERT_API_BASE = 'http://localhost:8001/api/v1/alerts';

const alertApi = axios.create({
  baseURL: ALERT_API_BASE,
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer demo-token-2024'
  }
});

export const alertApiService = {
  // Security alerts
  getSecurityAlerts: async (severity?: string, status?: string) => {
    const params = new URLSearchParams();
    if (severity) params.append('severity', severity);
    if (status) params.append('status', status);
    
    const response = await alertApi.get(`/security?${params.toString()}`);
    return response.data;
  },

  // System alerts
  getSystemAlerts: async (type?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    
    const response = await alertApi.get(`/system?${params.toString()}`);
    return response.data;
  },

  // Integrity alerts
  getIntegrityAlerts: async () => {
    const response = await alertApi.get('/integrity');
    return response.data;
  },

  // Alert history
  getAlertHistory: async (days: number = 7) => {
    const response = await alertApi.get(`/history?days=${days}`);
    return response.data;
  },

  // Alert management
  acknowledgeAlert: async (alertId: string) => {
    const response = await alertApi.post(`/acknowledge/${alertId}`);
    return response.data;
  },

  resolveAlert: async (alertId: string) => {
    const response = await alertApi.post(`/resolve/${alertId}`);
    return response.data;
  },

  escalateAlert: async (alertId: string) => {
    const response = await alertApi.post(`/escalate/${alertId}`);
    return response.data;
  },

  // Alert statistics
  getAlertStats: async () => {
    const response = await alertApi.get('/stats');
    return response.data;
  },

  // Alert configuration
  getAlertConfig: async () => {
    const response = await alertApi.get('/config');
    return response.data;
  },

  updateAlertConfig: async (config: any) => {
    const response = await alertApi.put('/config', config);
    return response.data;
  }
};

export default alertApiService;