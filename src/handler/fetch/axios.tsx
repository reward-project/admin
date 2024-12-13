"use client";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useUserStore from '@/store/useUserStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 배열
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 갱신 후 대기 중인 요청들을 처리하는 함수
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// 토큰 갱신을 기다리는 함수
const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

apiClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userInfo?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 토큰 갱신 중이면 새 토큰을 기다림
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshed = await useUserStore.getState().refreshToken();
        if (refreshed) {
          const newToken = useUserStore.getState().userInfo?.token;
          if (newToken) {
            onRefreshed(newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
        throw error;
      } catch (refreshError) {
        useUserStore.getState().clearUserInfo();
        toast.error('로그인이 필요합니다.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    toast.error(error.response?.data?.message || '오류가 발생했습니다.');
    return Promise.reject(error);
  }
);

export default apiClient;

export const sendMultipartForm = async (url: string, formData: FormData, method: 'post' | 'put') => {
  return apiClient({
    method: method,
    url: url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
