import axios from 'axios';

const CRYPTO_API_BASE = 'http://localhost:8001/api/v1/crypto';

const cryptoApi = axios.create({
  baseURL: CRYPTO_API_BASE,
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer demo-token-2024'
  }
});

export const cryptoApiService = {
  // Key operations
  generateKeyPair: async (keySize: number = 2048) => {
    const response = await cryptoApi.post('/keys/generate', { keySize });
    return response.data;
  },

  exportPrivateKey: async (password: string) => {
    const response = await cryptoApi.post('/keys/export/private', { password });
    return response.data;
  },

  importPrivateKey: async (keyData: string, password: string) => {
    const response = await cryptoApi.post('/keys/import/private', { keyData, password });
    return response.data;
  },

  // Signature operations
  getSignatureStats: async () => {
    const response = await cryptoApi.get('/signatures/stats');
    return response.data;
  },

  getRecentSignatures: async (limit: number = 10) => {
    const response = await cryptoApi.get(`/signatures/recent?limit=${limit}`);
    return response.data;
  },

  // TOTP operations
  getTOTPStatus: async () => {
    const response = await cryptoApi.get('/totp/status');
    return response.data;
  },

  regenerateTOTPSecret: async () => {
    const response = await cryptoApi.post('/totp/regenerate');
    return response.data;
  },

  verifyTOTP: async (code: string) => {
    const response = await cryptoApi.post('/totp/verify', { code });
    return response.data;
  },

  // Hash chain
  getHashChain: async (startBlock?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (startBlock) params.append('start', startBlock.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await cryptoApi.get(`/hashchain?${params.toString()}`);
    return response.data;
  },

  verifyHashChain: async () => {
    const response = await cryptoApi.post('/hashchain/verify');
    return response.data;
  }
};

export default cryptoApiService;