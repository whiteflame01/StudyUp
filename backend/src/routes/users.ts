import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import prisma from '../config/database';

const router = Router();

/**
 * GET /api/v1/users
 * Get all users with their profiles
 * Protected route - requires authentication
 */
router.get('/', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    // Fetch all users except the current user with their profiles
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId, // Exclude current user
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        isSetup: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            bio: true,
            gender: true,
            avatarUrl: true,
            college: true,
            major: true,
            year: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: {
        users,
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/v1/users/:id
 * Get a specific user by ID with their profile
 * Protected route - requires authentication
 */
router.get('/:id', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        isSetup: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            bio: true,
            gender: true,
            avatarUrl: true,
            college: true,
            major: true,
            year: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} does not exist`,
      });
      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
