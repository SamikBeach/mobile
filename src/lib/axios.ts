import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { ERROR_CODES } from '@/constants/error-codes';

// AsyncStorage 초기화 확인
const initializeAsyncStorage = async () => {
  try {
    await AsyncStorage.getItem('test-key');
    return true;
  } catch (error) {
    console.error('AsyncStorage is not initialized:', error);
    return false;
  }
};

const instance = axios.create({
  baseURL: 'http://localhost:3001/api/v2',
  withCredentials: true,
});

let isStorageInitialized = false;

const getToken = async () => {
  if (!isStorageInitialized) {
    isStorageInitialized = await initializeAsyncStorage();
  }

  if (!isStorageInitialized) {
    return null;
  }

  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const setToken = async (token: string) => {
  if (!isStorageInitialized) {
    isStorageInitialized = await initializeAsyncStorage();
  }

  if (!isStorageInitialized) {
    return;
  }

  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const removeToken = async () => {
  if (!isStorageInitialized) {
    isStorageInitialized = await initializeAsyncStorage();
  }

  if (!isStorageInitialized) {
    return;
  }

  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach(cb => cb(accessToken));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  try {
    const response = await instance.post<{ accessToken: string }>('/auth/refresh');
    const { accessToken } = response.data;
    await setToken(accessToken);
    return accessToken;
  } catch (error) {
    await removeToken();
    throw error;
  }
};

instance.interceptors.request.use(async config => {
  const token = await getToken();

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
