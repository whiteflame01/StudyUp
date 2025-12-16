import { Request, Response, NextFunction } from 'express';
import { verifyJWT, extractTokenFromHeader, JWTPayload } from '../utils/auth';
import { AuthService } from '../services/authService';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        username: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

const authService = new AuthService();

/**
 * JWT Authentication middleware
 * Validates JWT token and attaches user to request object
 */
export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
      return;
    }

    // Verify JWT token
    let decoded: JWTPayload;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      res.status(401).json({
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Invalid token',
      });
      return;
    }

    // Get user from database
    const user = await authService.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found',
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication failed',
    });
  }
}

/**
 * Optional JWT Authentication middleware
 * Attaches user to request if token is valid, but doesn't require authentication
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      try {
        const decoded = verifyJWT(token);
        const user = await authService.getUserById(decoded.userId);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors in optional auth
        console.log('Optional auth token error:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
}