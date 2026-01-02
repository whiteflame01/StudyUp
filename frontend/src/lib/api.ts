import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// ============ Posts API ============
import type { CreatePostRequest, CreatePostResponse, GetPostsResponse, GetCommentsResponse, AddCommentResponse } from '@/types/api';

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

  // Like or unlike a post
  toggleLike: async (postId: string) => {
    return apiClient.post(`/posts/${postId}/like`);
  },

  // Get comments for a post
  getComments: async (postId: string): Promise<GetCommentsResponse> => {
    return apiClient.get<GetCommentsResponse>(`/posts/${postId}/comments`);
  },

  // Add a comment to a post
  addComment: async (postId: string, content: string): Promise<AddCommentResponse> => {
    return apiClient.post<AddCommentResponse>(`/posts/${postId}/comments`, { content });
  },
};

// ============ Users API ============
import type { GetUsersResponse, GetUserResponse } from '@/types/api';

export const usersApi = {
  // Get all users
  getUsers: async (): Promise<GetUsersResponse> => {
    return apiClient.get<GetUsersResponse>('/users');
  },

  // Get a single user by ID
  getUserById: async (id: string): Promise<GetUserResponse> => {
    return apiClient.get<GetUserResponse>(`/users/${id}`);
  },
};

// ============ Chats API ============
import type { GetChatsResponse, GetChatResponse, GetMessagesResponse, SendMessageRequest, SendMessageResponse } from '@/types/api';

export const chatsApi = {
  // Get all chats for current user
  getChats: async (): Promise<GetChatsResponse> => {
    return apiClient.get<GetChatsResponse>('/chats');
  },

  // Get or create a chat with a specific user
  getChatWithUser: async (userId: string): Promise<GetChatResponse> => {
    return apiClient.get<GetChatResponse>(`/chats/${userId}`);
  },

  // Get messages in a chat
  getMessages: async (chatId: string): Promise<GetMessagesResponse> => {
    return apiClient.get<GetMessagesResponse>(`/chats/${chatId}/messages`);
  },

  // Send a message
  sendMessage: async (chatId: string, data: SendMessageRequest): Promise<SendMessageResponse> => {
    return apiClient.post<SendMessageResponse>(`/chats/${chatId}/messages`, data);
  },

  // Mark message as read
  markAsRead: async (chatId: string, messageId: string): Promise<void> => {
    return apiClient.patch(`/chats/${chatId}/messages/${messageId}/read`);
  },
};