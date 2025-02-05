import type { UserBase } from './user';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  nickname: string;
  password: string;
}

export interface RegisterCompleteDto {
  email: string;
  verificationCode: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserBase;
}

export interface EmailVerificationDto {
  email: string;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface EmailCheckResponse {
  available: boolean;
}

export interface EmailVerificationResponse {
  verified: boolean;
}

export interface LogoutResponse {
  message: string;
  action: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
}
