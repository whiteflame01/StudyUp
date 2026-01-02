import { Router, Request, Response } from 'express';
import { PostsService, CreatePostInput } from '../services/postsService';
import { authenticateJWT } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const postsService = new PostsService();

/**
 * POST /api/v1/posts
 * Create a new post (requires authentication)
 */
router.post('/', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    const input: CreatePostInput = req.body;
    const post = await postsService.createPost(req.user.id, input);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post,
      },
    });
  } catch (error) {
    console.error('Create post error:', error);

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

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create post',
    });
  }
});

/**
 * GET /api/v1/posts
 * Get all posts with pagination
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    // Get userId from token if available (optional authentication)
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId: string | undefined;
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        userId = decoded.userId;
      } catch (error) {
        // Token invalid or expired, continue without userId
      }
    }

    const result = await postsService.getPosts(page, limit, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get posts error:', error);

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch posts',
    });
  }
});

/**
 * GET /api/v1/posts/:id
 * Get a single post by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await postsService.getPostById(id);

    res.status(200).json({
      success: true,
      data: {
        post,
      },
    });
  } catch (error) {
    console.error('Get post error:', error);

    if (error instanceof Error && error.message === 'Post not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch post',
    });
  }
});

/**
 * DELETE /api/v1/posts/:id
 * Delete a post (requires authentication and ownership)
 */
router.delete('/:id', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;
    const result = await postsService.deletePost(id, req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Delete post error:', error);

    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        res.status(404).json({
          error: 'Not found',
          message: error.message,
        });
        return;
      }

      if (error.message === 'Unauthorized to delete this post') {
        res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete post',
    });
  }
});

/**
 * POST /api/v1/posts/:id/like
 * Like or unlike a post (requires authentication)
 */
router.post('/:id/like', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;
    const result = await postsService.toggleLike(id, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Toggle like error:', error);

    if (error instanceof Error && error.message === 'Post not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to toggle like',
    });
  }
});

/**
 * GET /api/v1/posts/:id/comments
 * Get comments for a post
 */
router.get('/:id/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comments = await postsService.getPostComments(id);

    res.status(200).json({
      success: true,
      data: {
        comments,
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);

    if (error instanceof Error && error.message === 'Post not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch comments',
    });
  }
});

/**
 * POST /api/v1/posts/:id/comments
 * Add a comment to a post (requires authentication)
 */
router.post('/:id/comments', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Comment content is required',
      });
      return;
    }

    const comment = await postsService.addComment(id, req.user.id, content.trim());

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error('Add comment error:', error);

    if (error instanceof Error && error.message === 'Post not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to add comment',
    });
  }
});

export default router;
