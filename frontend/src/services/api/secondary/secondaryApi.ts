import axios from 'axios';
import { CryptoStatus, AuditTrailStatus, SystemStatus } from '../../../types/secondary';

const SECONDARY_API_BASE = 'http://localhost:8001/api/v1';

const secondaryApi = axios.create({
  baseURL: SECONDARY_API_BASE,
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer demo-token-2024'
  }
});

export const secondaryApiService = {
  // System Status
  getSystemStatus: async (): Promise<SystemStatus> => {
    const response = await secondaryApi.get('/status');
    return response.data;
  },

  // Crypto Status
  getCryptoStatus: async (): Promise<CryptoStatus> => {
    const response = await secondaryApi.get('/crypto/status');
    return response.data;
  },

  // Audit Trail
  getAuditStatus: async (): Promise<AuditTrailStatus> => {
    const response = await secondaryApi.get('/audit/status');
    return response.data;
  },

  // Public Key
  getPublicKey: async () => {
    const response = await secondaryApi.get('/keys/public');
    return response.data;
  },

  // Key Management
  rotateKeys: async () => {
    const response = await secondaryApi.post('/keys/rotate');
    return response.data;
  },

  // Signing
  signLogEntry: async (request: any) => {
    const response = await secondaryApi.post('/sign/log', request);
    return response.data;
  },

  verifySignature: async (verificationData: any) => {
    const response = await secondaryApi.post('/verify/signature', verificationData);
    return response.data;
  },

  // TOTP
  getCurrentTOTP: async () => {
    const response = await secondaryApi.get('/totp/current');
    return response.data;
  },

  // System Integrity
  getSystemIntegrity: async () => {
    const response = await secondaryApi.get('/system/integrity');
    return response.data;
  },

  // Health Check
  healthCheck: async () => {
    const response = await secondaryApi.get('/health');
    return response.data;
  }
};

export default secondaryApiService;