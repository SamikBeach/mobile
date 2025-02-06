import axios from 'axios';
import { ERROR_CODES } from '@/constants/error-codes';
import { storage } from './storage';
import { authApi } from '@/apis/auth';
import { Platform } from 'react-native';

const baseURL = Platform.select({
  android: __DEV__ ? 'http://10.0.2.2:3001/api/v2' : process.env.API_URL,
  ios: __DEV__ ? 'http://localhost:3001/api/v2' : process.env.API_URL,
});

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    const refreshToken = await storage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await authApi.refresh({ refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
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

    // 401 에러 상세 로깅
    if (error.response?.status === 401) {
      console.log('401 Error Details:', {
        error: error.response?.data?.error,
        message: error.response?.data?.message,
        fullResponse: error.response?.data,
      });
    }

    // 토큰 만료로 인한 401 에러인지 확인
    const isTokenExpiredError =
      error.response?.status === 401 &&
      (error.response?.data?.error === ERROR_CODES.TOKEN_EXPIRED ||
        error.response?.data?.message === 'Token expired'); // 서버 응답 메시지도 체크

    console.log('isTokenExpiredError', isTokenExpiredError);
    // 토큰 만료 에러가 아니거나 이미 재시도했던 요청이면 에러를 그대로 반환
    if (!isTokenExpiredError || originalRequest._retry) {
      return Promise.reject(error);
    }

    console.log('isRefreshing', isRefreshing);

    // 토큰 리프레시가 진행 중이 아닐 때만 새로운 리프레시를 시도
    if (!isRefreshing) {
      isRefreshing = true;
      originalRequest._retry = true;
      console.log('isRefreshing 1');
      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newAccessToken);

        // 원래 요청을 새로운 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(error); // 원본 401 에러를 반환
      }
    }

    // 리프레시가 진행 중일 때는 새로운 Promise를 반환하여 토큰 리프레시 완료 후 처리
    return new Promise(resolve => {
      refreshSubscribers.push(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(instance(originalRequest));
      });
    });
  },
);

// 에러 인터셉터 추가
instance.interceptors.response.use(
  response => response,
  error => {
    if (__DEV__) {
      console.log('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  },
);

export default instance;
