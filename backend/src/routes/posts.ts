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

    if (error instanceof Error && error.message === 'Forum not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
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
    const forumId = typeof req.query.forumId === 'string' ? req.query.forumId : undefined;

    const result = await postsService.getPosts(page, limit, forumId);

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

export default router;
