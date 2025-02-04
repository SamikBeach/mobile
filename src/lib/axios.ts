import axios from 'axios';
import { ERROR_CODES } from '@/constants/error-codes';
import { storage } from './storage';
import { AuthResponse } from '@/types/auth';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api/v2',
  params: {
    encode: true,
  },
  paramsSerializer: {
    encode: (param: string) => encodeURIComponent(param),
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach(cb => cb(accessToken));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  try {
    // 리프레시 토큰 가져오기
    const refreshToken = await storage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await instance.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // 새로운 토큰들 저장
    await storage.setTokens(accessToken, newRefreshToken);

    return accessToken;
  } catch (error) {
    await storage.clearTokens();
    throw error;
  }
};

// 로그인 성공 시 토큰 저장 헬퍼 함수
export const saveAuthTokens = async (accessToken: string, refreshToken: string) => {
  await storage.setTokens(accessToken, refreshToken);
};

// 로그아웃 시 토큰 제거 헬퍼 함수
export const clearAuthTokens = async () => {
  await storage.clearTokens();
};

// Flipper 네트워크 로깅 설정
if (__DEV__) {
  instance.interceptors.request.use(request => {
    console.log('🚀 Request:', {
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.data,
      params: request.params,
    });
    return request;
  });

  instance.interceptors.response.use(
    response => {
      console.log('✅ Response:', {
        url: response.config.url,
        status: response.status,
        headers: response.headers,
        data: response.data,
        params: response.config.params,
      });
      return response;
    },
    error => {
      console.log('❌ Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        params: error.config?.params,
      });
      return Promise.reject(error);
    },
  );
}

instance.interceptors.request.use(async config => {
  const token = await storage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isTokenExpiredError =
      error.response?.status === 401 && error.response?.data?.error === ERROR_CODES.TOKEN_EXPIRED;

    if (!isTokenExpiredError || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(error);
      }
    }

    return new Promise(resolve => {
      refreshSubscribers.push(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(instance(originalRequest));
      });
    });
  },
);

export default instance;
