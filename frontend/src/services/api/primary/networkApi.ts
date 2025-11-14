import axios from 'axios';

const NETWORK_API_BASE = 'http://localhost:8000/api/v1/network';

const networkApi = axios.create({
  baseURL: NETWORK_API_BASE,
  timeout: 10000,
});

export const networkApiService = {
  // Real-time traffic monitoring
  getLiveTraffic: async () => {
    const response = await networkApi.get('/live');
    return response.data;
  },

  // Protocol statistics
  getProtocolStats: async () => {
    const response = await networkApi.get('/protocols');
    return response.data;
  },

  // Top talkers
  getTopTalkers: async (limit: number = 10) => {
    const response = await networkApi.get(`/talkers?limit=${limit}`);
    return response.data;
  },

  // Bandwidth usage
  getBandwidthUsage: async (timeRange: string = '1h') => {
    const response = await networkApi.get(`/bandwidth?range=${timeRange}`);
    return response.data;
  },

  // Connection tracking
  getActiveConnections: async () => {
    const response = await networkApi.get('/connections');
    return response.data;
  },

  // Network interfaces
  getInterfaceStats: async () => {
    const response = await networkApi.get('/interfaces');
    return response.data;
  }
};

export default networkApiService;