import axios from '@/lib/axios';
import type {
  AuthResponse,
  EmailVerificationDto,
  LoginDto,
  RegisterCompleteDto,
  RegisterDto,
  TokenRefreshResponse,
  VerifyEmailDto,
} from '@/types/auth';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

export const authApi = {
  login: async (data: { email: string; password: string }): Promise<LoginResponse> => {
    // TODO: 실제 API 구현
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: 'dummy_token',
          user: {
            id: '1',
            email: data.email,
            nickname: 'User',
          },
        });
      }, 1000);
    });
  },

  logout: () => axios.post<void>('/auth/logout'),

  googleLogin: (code: string) => axios.post<AuthResponse>('/auth/login/google', { code }),

  checkEmail: (data: EmailVerificationDto) =>
    axios.post<{ available: boolean }>('/auth/register/check-email', data),

  sendVerificationEmail: (data: EmailVerificationDto) =>
    axios.post<void>('/auth/email/verify/send', data),

  verifyEmail: (data: VerifyEmailDto) => axios.post<void>('/auth/email/verify', data),

  initiateRegistration: (data: RegisterDto) => axios.post<void>('/auth/register/initiate', data),

  completeRegistration: (data: RegisterCompleteDto) =>
    axios.post<AuthResponse>('/auth/register/complete', data),

  refresh: () => axios.post<TokenRefreshResponse>('/auth/refresh'),

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
