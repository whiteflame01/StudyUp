import { Router, Request, Response } from 'express';
import { AuthService, RegisterInput, LoginInput } from '../services/authService';
import { authenticateJWT } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const authService = new AuthService();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const input: RegisterInput = req.body;
    const result = await authService.register(input);
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({
          error: 'Registration failed',
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Registration failed',
    });
  }
});

/**
 * POST /api/v1/auth/login
 * Login user with email and password
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const input: LoginInput = req.body;
    const result = await authService.login(input);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user:result.user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    if (error instanceof Error) {
      if (error.message.includes('Invalid email or password')) {
        res.status(401).json({
          error: 'Authentication failed',
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Login failed',
    });
  }
});

/**
 * GET /api/v1/auth/me
 * Get current user information (protected route)
 */
router.get('/me', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not found in request',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User information retrieved successfully',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user information',
    });
  }
});

/**
 * POST /api/v1/auth/validate
 * Validate JWT token (protected route)
 */
router.post('/validate', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'Invalid token',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        user: req.user,
        valid: true,
      },
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Token validation failed',
    });
  }
});

export default router;