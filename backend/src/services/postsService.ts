import prisma from '../config/database';
import { z } from 'zod';

// Validation schema for creating a post
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content is too long'),
  topic: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export class PostsService {
  /**
   * Create a new post
   */
  async createPost(authorId: string, input: CreatePostInput) {
    // Validate input
    const validatedInput = createPostSchema.parse(input);

    // Create post in database
    const post = await prisma.post.create({
      data: {
        title: validatedInput.title,
        content: validatedInput.content,
        topic: validatedInput.topic,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                avatarUrl: true,
                college: true,
                major: true,
              }
            }
          }
        },
        _count: {
          select: {
            comments: true,
          }
        }
      }
    });

    return post;
  }

  /**
   * Get all posts with pagination
   */
  async getPosts(page: number = 1, limit: number = 20, userId?: string) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
              profile: {
                select: {
                  avatarUrl: true,
                  college: true,
                  major: true,
                }
              }
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            }
          },
          likes: userId ? {
            where: {
              userId: userId
            },
            select: {
              id: true
            }
          } : false
        }
      }),
      prisma.post.count(),
    ]);

    // Transform posts to include isLiked flag
    const transformedPosts = posts.map(post => ({
      ...post,
      isLiked: userId ? post.likes.length > 0 : false,
      likes: undefined // Remove likes array from response
    }));

    return {
      posts: transformedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Get a single post by ID
   */
  async getPostById(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                avatarUrl: true,
                college: true,
                major: true,
              }
            }
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    avatarUrl: true,
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc',
          }
        }
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string, authorId: string) {
    // Check if post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== authorId) {
      throw new Error('Unauthorized to delete this post');
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Post deleted successfully' };
  }

  /**
   * Like or unlike a post
   */
  async toggleLike(postId: string, userId: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        }
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        }
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId }
      });

      return {
        isLiked: false,
        likeCount,
        message: 'Post unliked successfully'
      };
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          postId,
          userId,
        }
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId }
      });

      return {
        isLiked: true,
        likeCount,
        message: 'Post liked successfully'
      };
    }
  }

  /**
   * Get comments for a post
   */
  async getPostComments(postId: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Get comments
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
                major: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return comments;
  }

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, userId: string, content: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
                major: true,
              }
            }
          }
        }
      }
    });

    return comment;
  }
}
