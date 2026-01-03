import { Router, Request, Response } from 'express';
import { authenticateJWT, optionalAuth } from '../middleware/auth';
import { ForumsService } from '../services/forumsService';
import { PostsService, CreatePostInput } from '../services/postsService';
import { z } from 'zod';

const router = Router();
const forumsService = new ForumsService();
const postsService = new PostsService();

// GET /api/v1/forums/my - list forums I'm a member of
router.get('/my', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const forums = await forumsService.getMyForums(req.user.id);

    res.json({
      success: true,
      data: {
        forums,
      },
    });
  } catch (error) {
    console.error('Error fetching my forums:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch my forums',
    });
  }
});

// GET /api/v1/forums - list all forums with counts
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const forums = await forumsService.listForums(req.user?.id);

    res.json({
      success: true,
      data: {
        forums,
      },
    });
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch forums',
    });
  }
});

// POST /api/v1/forums - create a forum (any authenticated user)
router.post('/', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const forum = await forumsService.createForum(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: 'Forum created',
      data: {
        forum,
      },
    });
  } catch (error) {
    console.error('Error creating forum:', error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create forum',
    });
  }
});

// PATCH /api/v1/forums/:forumId - update a forum (owner only)
router.patch('/:forumId', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { forumId } = req.params;
    const forum = await forumsService.updateForum(req.user.id, forumId, req.body);

    res.json({
      success: true,
      message: 'Forum updated',
      data: {
        forum,
      },
    });
  } catch (error) {
    console.error('Error updating forum:', error);

    if (error instanceof Error) {
      if (error.message === 'Forum not found') {
        res.status(404).json({
          error: 'Not found',
          message: error.message,
        });
        return;
      }

      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        });
        return;
      }
    }

    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update forum',
    });
  }
});

// POST /api/v1/forums/:forumId/join - join a forum (idempotent)
router.post('/:forumId/join', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { forumId } = req.params;
    const membership = await forumsService.joinForum(req.user.id, forumId);

    res.json({
      success: true,
      message: 'Joined forum',
      data: {
        membership,
      },
    });
  } catch (error) {
    console.error('Error joining forum:', error);

    if (error instanceof Error && error.message === 'Forum not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to join forum',
    });
  }
});

// GET /api/v1/forums/:forumId - get forum detail
router.get('/:forumId', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { forumId } = req.params;
    const forum = await forumsService.getForumById(forumId, req.user?.id);

    res.json({
      success: true,
      data: {
        forum,
      },
    });
  } catch (error) {
    console.error('Error fetching forum:', error);

    if (error instanceof Error && error.message === 'Forum not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch forum',
    });
  }
});

// GET /api/v1/forums/:forumId/posts - list posts inside a forum
router.get('/:forumId/posts', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { forumId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Ensure forum exists (and reuse membership flag if needed)
    await forumsService.getForumById(forumId, req.user?.id);

    const result = await postsService.getPosts(page, limit, forumId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);

    if (error instanceof Error && error.message === 'Forum not found') {
      res.status(404).json({
        error: 'Not found',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch forum posts',
    });
  }
});

// POST /api/v1/forums/:forumId/posts - create a post inside a forum
router.post('/:forumId/posts', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { forumId } = req.params;
    const input: CreatePostInput = { ...req.body, forumId };
    const post = await postsService.createPost(req.user.id, input);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post,
      },
    });
  } catch (error) {
    console.error('Error creating forum post:', error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors.map((err) => ({
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

export default router;
