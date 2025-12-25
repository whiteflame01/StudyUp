import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API client class with typed methods
export class ApiClient {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // File upload method
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.instance.post<T>(url, formData, config);
    return response.data;
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(api);

// Export the axios instance for direct use if needed
export { api };

// Utility function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Utility function to clear auth token
export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// ============ Posts API ============
import type { CreatePostRequest, CreatePostResponse, GetPostsResponse } from '@/types/api';

export const postsApi = {
  // Create a new post
  createPost: async (data: CreatePostRequest): Promise<CreatePostResponse> => {
    return apiClient.post<CreatePostResponse>('/posts', data);
  },

  // Get all posts with pagination
  getPosts: async (page: number = 1, limit: number = 20): Promise<GetPostsResponse> => {
    return apiClient.get<GetPostsResponse>(`/posts?page=${page}&limit=${limit}`);
  },

  // Get a single post by ID
  getPostById: async (id: string) => {
    return apiClient.get(`/posts/${id}`);
  },

  // Delete a post
  deletePost: async (id: string) => {
    return apiClient.delete(`/posts/${id}`);
  },
};