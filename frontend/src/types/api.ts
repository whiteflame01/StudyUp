// User and Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  subjects: string[];
  goals: string[];
  availability: Record<string, string[]>; // {"monday": ["14:00-16:00", "18:00-20:00"]}
  learningStyle?: string;
  avgRating: number;
  bio?: string;
  completionPct: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// User with Profile
export interface UserWithProfile {
  id: string;
  username: string;
  email: string;
  isSetup: boolean;
  createdAt: string;
  profile?: {
    id: string;
    bio?: string;
    gender?: string;
    avatarUrl?: string;
    college?: string;
    major?: string;
    year?: string;
  };
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: UserWithProfile[];
    total: number;
  };
}

export interface GetUserResponse {
  success: boolean;
  data: {
    user: UserWithProfile;
  };
}

// Chat and Message types
export interface ChatMessage {
  id: string;
  content: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  readAt?: string | null;
}

export interface Chat {
  id: string;
  otherUser: {
    id: string;
    username: string;
    email: string;
    profile?: {
      avatarUrl?: string;
    };
  };
  lastMessage?: ChatMessage | null;
  updatedAt: string;
}

export interface GetChatsResponse {
  success: boolean;
  data: {
    chats: Chat[];
  };
}

export interface GetChatResponse {
  success: boolean;
  data: {
    chat: {
      id: string;
      user1Id: string;
      user2Id: string;
      createdAt: string;
      updatedAt: string;
      messages: ChatMessage[];
    };
    chatId: string;
  };
}

export interface GetMessagesResponse {
  success: boolean;
  data: {
    messages: ChatMessage[];
  };
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    message: ChatMessage;
  };
}

// Post types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    profile?: {
      avatarUrl?: string;
    };
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  topic?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    email: string;
    profile?: {
      avatarUrl?: string;
      college?: string;
      major?: string;
    };
  };
  forum?: {
    id: string;
    name: string;
    slug: string;
  };
  comments?: Comment[];
  isLiked?: boolean;
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  topic?: string;
  forumId?: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: {
    post: Post;
  };
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: {
    comment: Comment;
  };
}

export interface LikePostResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

// Forum types
export interface Forum {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  memberCount: number;
  postCount: number;
  isMember?: boolean;
}

export interface CreateForumRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateForumRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface CreateForumResponse {
  success: boolean;
  message: string;
  data: {
    forum: Forum;
  };
}

export interface GetForumsResponse {
  success: boolean;
  data: {
    forums: Forum[];
  };
}

export interface GetForumResponse {
  success: boolean;
  data: {
    forum: Forum;
  };
}

export interface JoinForumResponse {
  success: boolean;
  message: string;
  data: {
    membership: {
      id: string;
      forumId: string;
      userId: string;
      createdAt: string;
    };
  };
}

export interface GetForumPostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetPostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// Connection types
export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  updatedAt: string;
  requester?: User;
  receiver?: User;
}

export interface ConnectionRequest {
  receiverId: string;
  message?: string;
}

// Recommendation types
export interface Recommendation {
  user: User;
  profile: Profile;
  compatibilityScore: number;
  matchDetails: {
    subjectMatch: number;
    goalSimilarity: number;
    scheduleOverlap: number;
    styleMatch: number;
    ratingBonus: number;
  };
}

export interface RecommendationFilters {
  subjects?: string[];
  availability?: string[];
  learningStyle?: string;
  minScore?: number;
  search?: string;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  sentAt: string;
  readAt?: string;
  sender?: User;
  receiver?: User;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
}

export interface Conversation {
  userId: string;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
}

// Study Session types
export interface StudySession {
  id: string;
  creatorId: string;
  title: string;
  subject: string;
  description?: string;
  dateTime: string;
  duration: number; // minutes
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurrenceId?: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
}

export interface CreateSessionRequest {
  title: string;
  subject: string;
  description?: string;
  dateTime: string;
  duration: number;
  participants: string[];
}

export interface CreateRecurringSessionRequest extends CreateSessionRequest {
  recurrencePattern: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  recurrenceEnd: string;
}

// Resource types
export interface Resource {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  sharedWith: string[];
  uploadedAt: string;
  user?: User;
}

export interface UploadResourceRequest {
  file: File;
  sharedWith?: string[];
}

// Feedback types
export interface Feedback {
  id: string;
  sessionId: string;
  raterId: string;
  ratedUserId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  session?: StudySession;
  rater?: User;
  ratedUser?: User;
}

export interface SubmitFeedbackRequest {
  sessionId: string;
  ratedUserId: string;
  rating: number;
  comment?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  sentAt: string;
  readAt?: string;
}

// Dashboard types
export interface DashboardStats {
  totalBuddies: number;
  totalStudyHours: number;
  averageRating: number;
  upcomingSessions: StudySession[];
  topRecommendations: Recommendation[];
}

export interface ActivityData {
  studyTimeByDay: { date: string; hours: number }[];
  sessionsBySubject: { subject: string; count: number }[];
  ratingTrend: { date: string; rating: number }[];
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Common API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}