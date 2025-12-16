import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .refine((val) => val === val.trim(), {
      message: 'Password cannot have leading or trailing spaces',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile validation schemas
export const profileSchema = z.object({
  subjects: z.array(z.string()).min(1, 'Please select at least one subject'),
  goals: z.array(z.string()).min(1, 'Please select at least one goal'),
  availability: z.record(z.array(z.string())),
  learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'reading']).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

// Session validation schemas
export const sessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  dateTime: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Session must be scheduled for a future date',
  }),
  duration: z.number().min(15, 'Session must be at least 15 minutes').max(480, 'Session cannot exceed 8 hours'),
  participants: z.array(z.string()).min(1, 'Please select at least one participant'),
});

export const recurringSessionSchema = sessionSchema.extend({
  recurrencePattern: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
  recurrenceEnd: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Recurrence end date must be in the future',
  }),
});

// Message validation schemas
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message must be less than 1000 characters'),
  receiverId: z.string().min(1, 'Receiver is required'),
});

// Feedback validation schemas
export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
  sessionId: z.string().min(1, 'Session ID is required'),
  ratedUserId: z.string().min(1, 'Rated user ID is required'),
});

// Connection validation schemas
export const connectionRequestSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  message: z.string().max(200, 'Message must be less than 200 characters').optional(),
});

// Search and filter validation schemas
export const recommendationFiltersSchema = z.object({
  subjects: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
  learningStyle: z.string().optional(),
  minScore: z.number().min(0).max(100).optional(),
  search: z.string().optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedTypes.includes(file.type);
  }, 'File type not supported. Please upload PDF, DOC, PPT, XLS, TXT, or image files.').refine((file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    return file.size <= maxSize;
  }, 'File size must be less than 50MB'),
});

// Export type definitions
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type SessionFormData = z.infer<typeof sessionSchema>;
export type RecurringSessionFormData = z.infer<typeof recurringSessionSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
export type ConnectionRequestFormData = z.infer<typeof connectionRequestSchema>;
export type RecommendationFiltersData = z.infer<typeof recommendationFiltersSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;