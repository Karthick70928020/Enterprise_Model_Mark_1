import axios from 'axios';

const SYSTEM_API_BASE = 'http://localhost:8000/api/v1/system';

const systemApi = axios.create({
  baseURL: SYSTEM_API_BASE,
  timeout: 10000,
});

export const systemApiService = {
  // System health
  getHealth: async () => {
    const response = await systemApi.get('/health');
    return response.data;
  },

  // Resource usage
  getResourceUsage: async () => {
    const response = await systemApi.get('/resources');
    return response.data;
  },

  // Service status
  getServiceStatus: async () => {
    const response = await systemApi.get('/services');
    return response.data;
  },

  // System configuration
  getConfig: async () => {
    const response = await systemApi.get('/config');
    return response.data;
  },

  updateConfig: async (config: any) => {
    const response = await systemApi.put('/config', config);
    return response.data;
  },

  // Logs
  getSystemLogs: async (level?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (limit) params.append('limit', limit.toString());
    
    const response = await systemApi.get(`/logs?${params.toString()}`);
    return response.data;
  },

  // Backup and restore
  createBackup: async () => {
    const response = await systemApi.post('/backup');
    return response.data;
  },

  restoreBackup: async (backupId: string) => {
    const response = await systemApi.post(`/restore/${backupId}`);
    return response.data;
  }
};

export default systemApiService;