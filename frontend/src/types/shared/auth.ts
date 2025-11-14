export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  last_login: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  totp_code?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface TOTPSetup {
  secret: string;
  qr_code: string;
  backup_codes: string[];
}