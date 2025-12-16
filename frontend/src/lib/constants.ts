// Predefined subjects list
export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Engineering',
  'Economics',
  'Business',
  'Psychology',
  'History',
  'Literature',
  'Philosophy',
  'Political Science',
  'Sociology',
  'Anthropology',
  'Geography',
  'Environmental Science',
  'Statistics',
  'Data Science',
  'Medicine',
  'Law',
  'Art',
  'Music',
  'Languages',
  'Other',
] as const;

// Learning styles
export const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual' },
  { value: 'auditory', label: 'Auditory' },
  { value: 'kinesthetic', label: 'Kinesthetic' },
  { value: 'reading', label: 'Reading/Writing' },
] as const;

// Study goals
export const STUDY_GOALS = [
  'Exam Preparation',
  'Homework Help',
  'Project Collaboration',
  'Concept Review',
  'Test Practice',
  'Research Assistance',
  'Skill Development',
  'Language Practice',
  'Career Preparation',
  'Academic Writing',
  'Problem Solving',
  'Group Study',
] as const;

// Days of the week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

// Time slots for availability
export const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30',
] as const;

// Session durations (in minutes)
export const SESSION_DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
  { value: 300, label: '5 hours' },
  { value: 360, label: '6 hours' },
  { value: 420, label: '7 hours' },
  { value: 480, label: '8 hours' },
] as const;

// Recurrence patterns
export const RECURRENCE_PATTERNS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

// File type mappings
export const FILE_TYPE_ICONS = {
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-powerpoint': '📊',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
  'application/vnd.ms-excel': '📈',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📈',
  'text/plain': '📄',
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'image/gif': '🖼️',
  'image/webp': '🖼️',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',
  NEW_MESSAGE: 'new_message',
  SESSION_REMINDER: 'session_reminder',
  SESSION_INVITE: 'session_invite',
  FEEDBACK_RECEIVED: 'feedback_received',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  USERS: {
    ME: '/users/me',
    PROFILE: '/users/me/profile',
    BY_ID: (id: string) => `/users/${id}`,
  },
  RECOMMENDATIONS: '/recommendations',
  CONNECTIONS: {
    BASE: '/connections',
    REQUEST: '/connections/request',
    ACCEPT: (id: string) => `/connections/${id}/accept`,
    DECLINE: (id: string) => `/connections/${id}/decline`,
    PENDING: '/connections/pending',
  },
  MESSAGES: {
    BASE: '/messages',
    CONVERSATION: (userId: string) => `/messages/${userId}`,
    CONVERSATIONS: '/messages/conversations',
    READ: (id: string) => `/messages/${id}/read`,
  },
  SESSIONS: {
    BASE: '/sessions',
    BY_ID: (id: string) => `/sessions/${id}`,
    RECURRING: '/sessions/recurring',
  },
  RESOURCES: {
    BASE: '/resources',
    BY_ID: (id: string) => `/resources/${id}`,
    DOWNLOAD: (id: string) => `/resources/${id}/download`,
  },
  FEEDBACK: {
    BASE: '/feedback',
    BY_USER: (userId: string) => `/feedback/${userId}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITY: '/dashboard/activity',
    EXPORT: '/dashboard/export',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
} as const;