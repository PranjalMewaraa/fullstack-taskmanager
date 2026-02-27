import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from './env';
import { ApiErrorResponse, ApiSuccess, TasksListResponse, Task, User } from './types';

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];
let unauthorizedHandler: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

const notifyRefreshSubscribers = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

const shouldSkipRefresh = (url: string | undefined) => {
  if (!url) return false;
  return ['/auth/login', '/auth/register', '/auth/refresh'].some((path) => url.includes(path));
};

const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetriableConfig;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await refreshClient.post<ApiSuccess<{ accessToken: string; user: User }>>(
        '/auth/refresh',
      );

      const newToken = refreshResponse.data.data.accessToken;
      setAccessToken(newToken);
      notifyRefreshSubscribers(newToken);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      notifyRefreshSubscribers(null);
      unauthorizedHandler?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

const unwrap = <T>(response: { data: ApiSuccess<T> }) => response.data.data;

export const authApi = {
  register: (payload: { email: string; password: string }) =>
    api.post<ApiSuccess<{ id: string; email: string; createdAt: string }>>('/auth/register', payload),
  login: (payload: { email: string; password: string }) =>
    api.post<ApiSuccess<{ accessToken: string; user: User }>>('/auth/login', payload),
  refresh: () => api.post<ApiSuccess<{ accessToken: string; user: User }>>('/auth/refresh', {}),
  logout: () => api.post<ApiSuccess<null>>('/auth/logout', {}),
};

export const tasksApi = {
  list: async (params: { page: number; limit: number; status?: 'PENDING' | 'COMPLETED'; search?: string }) => {
    const response = await api.get<ApiSuccess<TasksListResponse>>('/tasks', { params });
    return unwrap(response);
  },
  create: async (payload: { title: string; description?: string }) => {
    const response = await api.post<ApiSuccess<Task>>('/tasks', payload);
    return unwrap(response);
  },
  update: async (taskId: string, payload: { title?: string; description?: string; status?: 'PENDING' | 'COMPLETED' }) => {
    const response = await api.patch<ApiSuccess<Task>>(`/tasks/${taskId}`, payload);
    return unwrap(response);
  },
  remove: async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
  },
  toggle: async (taskId: string) => {
    const response = await api.patch<ApiSuccess<Task>>(`/tasks/${taskId}/toggle`, {});
    return unwrap(response);
  },
};
