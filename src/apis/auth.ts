import axios, { saveAuthTokens, clearAuthTokens } from '@/lib/axios';
import type {
  AuthResponse,
  EmailVerificationDto,
  LoginDto,
  RegisterCompleteDto,
  RegisterDto,
  VerifyEmailDto,
} from '@/types/auth';

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await axios.post<AuthResponse>('/auth/login/email', data);
    await saveAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response;
  },

  logout: async () => {
    const response = await axios.post<void>('/auth/logout');
    await clearAuthTokens();
    return response;
  },

  googleLogin: async (code: string) => {
    const response = await axios.post<AuthResponse>('/auth/login/google', { code });
    await saveAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response;
  },

  checkEmail: (data: EmailVerificationDto) =>
    axios.post<{ available: boolean }>('/auth/register/check-email', data),

  sendVerificationEmail: (data: EmailVerificationDto) =>
    axios.post<void>('/auth/email/verify/send', data),

  verifyEmail: (data: VerifyEmailDto) => axios.post<void>('/auth/email/verify', data),

  initiateRegistration: (data: RegisterDto) => axios.post<void>('/auth/register/initiate', data),

  completeRegistration: async (data: RegisterCompleteDto) => {
    const response = await axios.post<AuthResponse>('/auth/register/complete', data);
    await saveAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response;
  },

  refresh: () => axios.post<AuthResponse>('/auth/refresh'),

  sendPasswordResetEmail: (email: string) =>
    axios.post<{ message: string }>('/auth/password/reset-request', { email }),

  verifyPasswordResetToken: (email: string, token: string) =>
    axios.get<{ valid: boolean }>('/auth/password/verify-token', {
      params: { email, token },
    }),

  resetPassword: (email: string, token: string, newPassword: string) =>
    axios.post<{ message: string }>('/auth/password/reset', {
      email,
      token,
      newPassword,
    }),
};
