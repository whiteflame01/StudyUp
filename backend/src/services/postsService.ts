import prisma from '../config/database';
import { z } from 'zod';

// Validation schema for creating a post
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content is too long'),
  topic: z.string().optional(),
  forumId: z.string().uuid('Invalid forum').optional(),
});

// Validation schema for creating a comment
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(1000, 'Content is too long'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export class PostsService {
  /**
   * Create a new post
   */
  async createPost(authorId: string, input: CreatePostInput) {
    // Validate input
    const validatedInput = createPostSchema.parse(input);

    if (validatedInput.forumId) {
      // Ensure forum exists when provided
      const forum = await prisma.forum.findUnique({
        where: { id: validatedInput.forumId },
      });

      if (!forum) {
        throw new Error('Forum not found');
      }

      // Auto-join forum for the author (forums are open)
      await prisma.forumMembership.upsert({
        where: {
          forumId_userId: {
            forumId: validatedInput.forumId,
            userId: authorId,
          },
        },
        create: {
          forumId: validatedInput.forumId,
          userId: authorId,
        },
        update: {},
      });
    }

    // Create post in database
    const post = await prisma.post.create({
      data: {
        title: validatedInput.title,
        content: validatedInput.content,
        topic: validatedInput.topic,
        authorId,
        forumId: validatedInput.forumId,
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
        forum: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      }
    });

    return post;
  }

  /**
   * Get all posts with pagination
   */
  async getPosts(page: number = 1, limit: number = 20, forumId?: string, userId?: string) {
    const skip = (page - 1) * limit;
    
    // If fetching main feed (no forumId), exclude posts from private forums
    const whereClause = forumId
      ? { forumId }
      : {
          OR: [
            { forumId: null }, // Posts not in any forum
            {
              forum: {
                isPrivate: false, // Posts from public forums only
              },
            },
          ],
        };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        where: whereClause,
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
          forum: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            }
          }
        }
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    // Check which posts the user has liked
    let postsWithLikeStatus = posts;
    if (userId) {
      const userLikes = await prisma.like.findMany({
        where: {
          userId,
          postId: { in: posts.map(p => p.id) },
        },
        select: { postId: true },
      });
      
      const likedPostIds = new Set(userLikes.map(l => l.postId));
      postsWithLikeStatus = posts.map(post => ({
        ...post,
        isLiked: likedPostIds.has(post.id),
      }));
    } else {
      postsWithLikeStatus = posts.map(post => ({
        ...post,
        isLiked: false,
      }));
    }

    return {
      posts: postsWithLikeStatus,
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
  async getPostById(postId: string, userId?: string) {
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
        forum: {
          select: {
            id: true,
            name: true,
            slug: true,
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

    // Check if user has liked this post
    let isLiked = false;
    if (userId) {
      const like = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      isLiked = !!like;
    }

    return {
      ...post,
      isLiked,
    };
  }

  /**
   * Like a post
   */
  async likePost(postId: string, userId: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      throw new Error('Post already liked');
    }

    // Create like
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return { liked: true, likeCount };
  }

  /**
   * Unlike a post
   */
  async unlikePost(postId: string, userId: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!existingLike) {
      throw new Error('Post not liked');
    }

    // Delete like
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return { liked: false, likeCount };
  }

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, authorId: string, input: CreateCommentInput) {
    // Validate input
    const validatedInput = createCommentSchema.parse(input);

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
        content: validatedInput.content,
        postId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return comment;
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
}
