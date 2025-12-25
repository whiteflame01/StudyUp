export interface User {
  id: string;
  username: string;
  email: string;
  isSetup: boolean;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  subjects: string[];
  goals: Goal[];
  availability: Availability;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  bio?: string;
  avgRating: number;
  totalSessions: number;
  completionPercentage: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: Date;
}

export interface Availability {
  [day: string]: string[]; // e.g., { "monday": ["14:00-16:00", "18:00-20:00"] }
}

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  requester?: User;
  receiver?: User;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  chatId: string;
  createdAt: Date | string;
  readAt?: Date | string | null;
  attachments?: Attachment[];
  sentAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface StudySession {
  id: string;
  creatorId: string;
  creator?: User;
  title: string;
  subject: string;
  description?: string;
  dateTime: Date;
  duration: number; // minutes
  participants: string[];
  participantUsers?: User[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

export interface Feedback {
  id: string;
  sessionId: string;
  raterId: string;
  ratedUserId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface Recommendation {
  user: User;
  compatibilityScore: number;
  matchReasons: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'new_message' | 'session_reminder' | 'session_invite' | 'feedback_received';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export interface DashboardStats {
  totalBuddies: number;
  studyHours: number;
  avgRating: number;
  sessionsCompleted: number;
  upcomingSessions: number;
  pendingRequests: number;
}