import axios from 'axios';
import { ThreatReport } from '../../../types/primary';

const THREAT_API_BASE = 'http://localhost:8000/api/v1/threats';

const threatApi = axios.create({
  baseURL: THREAT_API_BASE,
  timeout: 10000,
});

export const threatApiService = {
  // Current threats
  getActiveThreats: async (): Promise<ThreatReport[]> => {
    const response = await threatApi.get('/active');
    return response.data;
  },

  // Threat history
  getThreatHistory: async (days: number = 7) => {
    const response = await threatApi.get(`/history?days=${days}`);
    return response.data;
  },

  // Threat statistics
  getThreatStats: async () => {
    const response = await threatApi.get('/stats');
    return response.data;
  },

  // Threat details
  getThreatDetails: async (threatId: string) => {
    const response = await threatApi.get(`/details/${threatId}`);
    return response.data;
  },

  // Mitigation actions
  mitigateThreat: async (threatId: string, action: string) => {
    const response = await threatApi.post(`/mitigate/${threatId}`, { action });
    return response.data;
  },

  // False positive reporting
  reportFalsePositive: async (threatId: string) => {
    const response = await threatApi.post(`/false-positive/${threatId}`);
    return response.data;
  },

  // Behavioral analysis
  getBehavioralAnalysis: async () => {
    const response = await threatApi.get('/behavioral');
    return response.data;
  },

  // Pattern recognition
  getDetectedPatterns: async () => {
    const response = await threatApi.get('/patterns');
    return response.data;
  }
};

export default threatApiService;