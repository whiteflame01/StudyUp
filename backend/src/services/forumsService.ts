import prisma from '../config/database';
import { z } from 'zod';

const createForumSchema = z.object({
  name: z.string().min(3, 'Forum name is required').max(80, 'Forum name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  isPrivate: z.boolean().optional().default(false),
});

const updateForumSchema = z.object({
  name: z.string().min(3, 'Forum name is required').max(80, 'Forum name is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  isPrivate: z.boolean().optional(),
});

export type CreateForumInput = z.infer<typeof createForumSchema>;
export type UpdateForumInput = z.infer<typeof updateForumSchema>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export class ForumsService {
  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let candidate = base || `forum-${Date.now()}`;
    let suffix = 1;

    while (true) {
      const existing = await prisma.forum.findUnique({ where: { slug: candidate } });
      if (!existing) return candidate;
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
  }

  async createForum(userId: string, input: CreateForumInput) {
    const data = createForumSchema.parse(input);
    const slug = await this.generateUniqueSlug(data.name);

    const forum = await prisma.forum.create({
      data: {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate ?? false,
        slug,
        createdById: userId,
        memberships: {
          create: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
    });

    return {
      ...forum,
      memberCount: forum._count.memberships,
      postCount: forum._count.posts,
    };
  }

  async listForums(currentUserId?: string) {
    const [forums, memberships] = await Promise.all([
      prisma.forum.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              memberships: true,
              posts: true,
            },
          },
        },
      }),
      currentUserId
        ? prisma.forumMembership.findMany({
            where: { userId: currentUserId },
            select: { forumId: true },
          })
        : Promise.resolve([]),
    ]);

    const memberSet = new Set(memberships.map((m) => m.forumId));

    // Show all forums regardless of privacy - anyone can see and join them
    return forums.map((forum) => ({
      ...forum,
      memberCount: forum._count.memberships,
      postCount: forum._count.posts,
      isMember: memberSet.has(forum.id),
    }));
  }

  async getMyForums(userId: string) {
    const forums = await prisma.forum.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
    });

    return forums.map((forum) => ({
      ...forum,
      memberCount: forum._count.memberships,
      postCount: forum._count.posts,
      isMember: true,
    }));
  }

  async joinForum(userId: string, forumId: string) {
    const forum = await prisma.forum.findUnique({ where: { id: forumId } });
    if (!forum) {
      throw new Error('Forum not found');
    }

    const membership = await prisma.forumMembership.upsert({
      where: {
        forumId_userId: {
          forumId,
          userId,
        },
      },
      create: {
        forumId,
        userId,
      },
      update: {},
      include: {
        forum: true,
      },
    });

    return membership;
  }

  async getForumById(forumId: string, currentUserId?: string) {
    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    const membership = currentUserId
      ? await prisma.forumMembership.findUnique({
          where: {
            forumId_userId: {
              forumId,
              userId: currentUserId,
            },
          },
        })
      : null;

    const isMember = Boolean(membership);

    // All forums are visible - private just means posts don't show in main feed
    return {
      ...forum,
      memberCount: forum._count.memberships,
      postCount: forum._count.posts,
      isMember,
    };
  }

  async updateForum(userId: string, forumId: string, input: UpdateForumInput) {
    const data = updateForumSchema.parse(input);

    // Check if forum exists and user is the owner
    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    if (forum.createdById !== userId) {
      throw new Error('Unauthorized: Only the forum owner can update this forum');
    }

    // Generate new slug if name is being changed
    const slug = data.name ? await this.generateUniqueSlug(data.name) : undefined;

    const updatedForum = await prisma.forum.update({
      where: { id: forumId },
      data: {
        ...(data.name && { name: data.name, slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isPrivate !== undefined && { isPrivate: data.isPrivate }),
      },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
    });

    return {
      ...updatedForum,
      memberCount: updatedForum._count.memberships,
      postCount: updatedForum._count.posts,
    };
  }
}
