import axios from 'axios';

const AUTH_API_BASE = '/api/auth';

const authApi = axios.create({
  baseURL: AUTH_API_BASE,
  timeout: 10000,
});

export const authApiService = {
  // Login
  login: async (username: string, password: string, totpCode: string) => {
    const response = await authApi.post('/login', {
      username,
      password,
      totp_code: totpCode
    });
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Logout
  logout: async () => {
    await authApi.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await authApi.post('/refresh', { refresh_token: refreshToken });
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await authApi.get('/verify');
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await authApi.post('/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const response = await authApi.post('/reset-password', { email });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await authApi.get('/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: any) => {
    const response = await authApi.put('/profile', profileData);
    return response.data;
  }
};

export default authApiService;