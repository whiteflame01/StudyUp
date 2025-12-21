import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ADJECTIVES, NOUNS } from './words';

// Password validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')

// Email validation schema
export const emailSchema = z.string().email('Invalid email format');

// Registration validation schema
export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// JWT payload interface
export interface JWTPayload {
  userWithoutPassword: {
    id: string;
    email: string;
    username: string;
    isSetup: boolean;
    name: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  iat?: number;
  exp?: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token with 24-hour expiry
 */
export function generateJWT(payload: { userWithoutPassword: any }): string {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || '24h') as string;
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn,
    issuer: 'study-up-platform',
    audience: 'study-up-users',
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 */
export function verifyJWT(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'study-up-platform',
      audience: 'study-up-users',
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

export function generateUsername(): string {
  const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  const adjective = (ADJECTIVES.length && getRandom(ADJECTIVES)) || 'quick';
  const noun = (NOUNS.length && getRandom(NOUNS)) || 'fox';

  const suffix = Math.floor(Math.random() * 900) + 100;

  return `${adjective}${noun}${suffix}`.toLowerCase();
}