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
  /**
   * 이메일/비밀번호로 로그인합니다.
   */
  login: async (data: LoginDto) => {
    const response = await axios.post<AuthResponse>('/auth/login/email', data);
    await saveAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response;
  },

  /**
   * 현재 로그인된 사용자를 로그아웃합니다.
   */
  logout: async () => {
    const response = await axios.post<void>('/auth/logout');
    await clearAuthTokens();
    return response;
  },

  /**
   * 구글 OAuth 인증 코드로 로그인합니다.
   */
  googleLogin: async ({ code, clientType }: { code: string; clientType: 'ios' | 'android' }) => {
    const response = await axios.post<AuthResponse>('/auth/login/google', {
      code,
      clientType,
    });
    await saveAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response;
  },

  /**
   * 이메일 주소의 사용 가능 여부를 확인합니다.
   */
  checkEmail: (data: EmailVerificationDto) =>
    axios.post<{ available: boolean }>('/auth/register/check-email', data),

  /**
   * 이메일 인증 코드를 발송합니다.
   */
  sendVerificationEmail: (data: EmailVerificationDto) =>
    axios.post<void>('/auth/email/verify/send', data),

  /**
   * 이메일 인증 코드를 확인합니다.
   */
  verifyEmail: (data: VerifyEmailDto) => axios.post<void>('/auth/email/verify', data),

  /**
   * 회원가입을 시작하고 사용자 정보를 임시 저장합니다.
   */
  initiateRegistration: (data: RegisterDto) => axios.post<void>('/auth/register/initiate', data),

  /**
   * 이메일 인증 후 회원가입을 완료합니다.
   */
  completeRegistration: async (data: RegisterCompleteDto) => {
    const response = await axios.post<AuthResponse>('/auth/register/complete', data);
    await saveAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response;
  },

  /**
   * 리프레시 토큰으로 새로운 액세스 토큰을 발급받습니다.
   */
  refresh: ({ refreshToken }: { refreshToken: string }) =>
    axios.post<AuthResponse>('/auth/refresh', { refreshToken }),

  /**
   * 비밀번호 재설정을 위한 인증 코드를 발송합니다.
   */
  sendPasswordResetCode: (email: string) =>
    axios.post<{ message: string }>('/auth/password/send-code', { email }),

  /**
   * 비밀번호 재설정 인증 코드를 검증합니다.
   */
  verifyPasswordResetCode: (email: string, code: string) =>
    axios.post<{ verified: boolean }>('/auth/password/verify-code', {
      email,
      code,
    }),

  /**
   * 새로운 비밀번호로 재설정합니다.
   */
  resetPassword: (email: string, newPassword: string) =>
    axios.post<{ message: string }>('/auth/password/reset', {
      email,
      newPassword,
    }),
};
