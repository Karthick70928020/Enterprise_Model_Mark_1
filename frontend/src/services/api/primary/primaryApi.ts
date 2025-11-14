import axios from 'axios';
import { SystemStatus, NetworkStats, ThreatReport, FirewallRule } from '../../../types/primary';

const PRIMARY_API_BASE = 'http://localhost:8000/api/v1';

const primaryApi = axios.create({
  baseURL: PRIMARY_API_BASE,
  timeout: 10000,
});

export const primaryApiService = {
  // System Status
  getSystemStatus: async (): Promise<SystemStatus> => {
    const response = await primaryApi.get('/status');
    return response.data;
  },

  // Network Monitoring
  getNetworkStats: async (): Promise<NetworkStats> => {
    const response = await primaryApi.get('/network/stats');
    return response.data;
  },

  getTrafficData: async (timeRange: string) => {
    const response = await primaryApi.get(`/network/traffic?range=${timeRange}`);
    return response.data;
  },

  // Threats
  getCurrentThreats: async (): Promise<ThreatReport[]> => {
    const response = await primaryApi.get('/threats/current');
    return response.data;
  },

  getThreatHistory: async (days: number = 7) => {
    const response = await primaryApi.get(`/threats/history?days=${days}`);
    return response.data;
  },

  // Firewall
  getFirewallRules: async (): Promise<FirewallRule[]> => {
    const response = await primaryApi.get('/firewall/rules');
    return response.data;
  },

  createFirewallRule: async (rule: Partial<FirewallRule>): Promise<FirewallRule> => {
    const response = await primaryApi.post('/firewall/rules', rule);
    return response.data;
  },

  updateFirewallRule: async (ruleId: string, rule: Partial<FirewallRule>): Promise<FirewallRule> => {
    const response = await primaryApi.put(`/firewall/rules/${ruleId}`, rule);
    return response.data;
  },

  deleteFirewallRule: async (ruleId: string): Promise<void> => {
    await primaryApi.delete(`/firewall/rules/${ruleId}`);
  },

  toggleFirewallRule: async (ruleId: string, enabled: boolean): Promise<void> => {
    await primaryApi.patch(`/firewall/rules/${ruleId}`, { enabled });
  },

  // AI Models
  getAIModelsStatus: async () => {
    const response = await primaryApi.get('/ai/models/status');
    return response.data;
  },

  retrainModel: async (modelName: string) => {
    const response = await primaryApi.post(`/ai/models/${modelName}/retrain`);
    return response.data;
  },

  // Behavioral Analysis
  getBehavioralData: async () => {
    const response = await primaryApi.get('/behavioral/analysis');
    return response.data;
  },

  getPatterns: async () => {
    const response = await primaryApi.get('/patterns/detected');
    return response.data;
  },

  // Health Check
  healthCheck: async () => {
    const response = await primaryApi.get('/health');
    return response.data;
  },

  // Logs
  submitLog: async (logEntry: any) => {
    const response = await primaryApi.post('/logs/submit', logEntry);
    return response.data;
  }
};

export default primaryApiService;