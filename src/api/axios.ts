import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.select({
  android: __DEV__ ? 'http://10.0.2.2:3000' : 'https://api.yourserver.com',
  ios: __DEV__ ? 'http://localhost:3000' : 'https://api.yourserver.com',
});

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 에러 인터셉터 추가
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
); 