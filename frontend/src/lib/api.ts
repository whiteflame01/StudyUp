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
      // Redirect to login (session expired or not authenticated)
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

// ============ Posts API ============
import type { 
  CreatePostRequest, 
  CreatePostResponse, 
  GetPostsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  LikePostResponse
} from '@/types/api';

export const postsApi = {
  // Create a new post
  createPost: async (data: CreatePostRequest): Promise<CreatePostResponse> => {
    return apiClient.post<CreatePostResponse>('/posts', data);
  },

  // Get all posts with pagination (optionally filter by forum)
  getPosts: async (page: number = 1, limit: number = 20, forumId?: string): Promise<GetPostsResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (forumId) {
      params.append('forumId', forumId);
    }
    return apiClient.get<GetPostsResponse>(`/posts?${params.toString()}`);
  },

  // Get a single post by ID
  getPostById: async (id: string) => {
    return apiClient.get(`/posts/${id}`);
  },

  // Delete a post
  deletePost: async (id: string) => {
    return apiClient.delete(`/posts/${id}`);
  },

  // Like a post
  likePost: async (id: string): Promise<LikePostResponse> => {
    return apiClient.post<LikePostResponse>(`/posts/${id}/like`);
  },

  // Unlike a post
  unlikePost: async (id: string): Promise<LikePostResponse> => {
    return apiClient.delete<LikePostResponse>(`/posts/${id}/like`);
  },

  // Add a comment to a post
  addComment: async (id: string, data: CreateCommentRequest): Promise<CreateCommentResponse> => {
    return apiClient.post<CreateCommentResponse>(`/posts/${id}/comments`, data);
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

// ============ Forums API ============
import type { 
  GetForumsResponse, 
  GetForumResponse, 
  CreateForumRequest, 
  CreateForumResponse,
  UpdateForumRequest,
  JoinForumResponse,
  GetForumPostsResponse,
  ApiResponse,
  Forum
} from '@/types/api';

export const forumsApi = {
  // Get all forums
  getForums: async (): Promise<GetForumsResponse> => {
    return apiClient.get<GetForumsResponse>('/forums');
  },

  // Get forum by ID
  getForumById: async (forumId: string): Promise<GetForumResponse> => {
    return apiClient.get<GetForumResponse>(`/forums/${forumId}`);
  },

  // Create a new forum
  createForum: async (data: CreateForumRequest): Promise<CreateForumResponse> => {
    return apiClient.post<CreateForumResponse>('/forums', data);
  },

  // Join a forum
  joinForum: async (forumId: string): Promise<JoinForumResponse> => {
    return apiClient.post<JoinForumResponse>(`/forums/${forumId}/join`);
  },

  // Get posts in a forum
  getForumPosts: async (forumId: string, page: number = 1, limit: number = 20): Promise<GetForumPostsResponse> => {
    return apiClient.get<GetForumPostsResponse>(`/forums/${forumId}/posts?page=${page}&limit=${limit}`);
  },

  // Update a forum (owner only)
  updateForum: async (forumId: string, data: UpdateForumRequest): Promise<Forum> => {
    const response = await apiClient.patch<ApiResponse<{ forum: Forum }>>(`/forums/${forumId}`, data);
    return response.data.data.forum;
  },

  // Create a post in a forum
  createForumPost: async (forumId: string, data: Omit<CreatePostRequest, 'forumId'>): Promise<CreatePostResponse> => {
    return apiClient.post<CreatePostResponse>(`/forums/${forumId}/posts`, data);
  },
};