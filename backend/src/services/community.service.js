import prisma from '../config/database.js';

export async function listPosts({ tag, search, page = 1, limit = 10 }) {
  const safeLimit = Math.min(Math.max(1, parseInt(limit, 10) || 10), 50);
  const safePage = Math.max(1, parseInt(page, 10) || 1);

  const where = {};
  if (tag) where.tags = { has: tag };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, posts] = await Promise.all([
    prisma.communityPost.count({ where }),
    prisma.communityPost.findMany({
      where,
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            role: true,
            profile: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    }),
  ]);

  return { posts, total, page: safePage, limit: safeLimit, totalPages: Math.ceil(total / safeLimit) };
}

export async function getPostById(id) {
  return prisma.communityPost.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          role: true,
          profile: { select: { firstName: true, lastName: true, avatar: true } },
        },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: {
              id: true,
              role: true,
              profile: { select: { firstName: true, lastName: true, avatar: true } },
            },
          },
        },
      },
    },
  });
}

export async function createPost(authorId, data) {
  return prisma.communityPost.create({
    data: {
      ...data,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          profile: { select: { firstName: true, lastName: true, avatar: true } },
        },
      },
    },
  });
}

export async function togglePostLike(postId, userId) {
  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error('POST_NOT_FOUND');

  const likedByIds = post.likedByIds || [];
  const alreadyLiked = likedByIds.includes(userId);

  const updatedIds = alreadyLiked
    ? likedByIds.filter(id => id !== userId)
    : [...likedByIds, userId];

  return prisma.communityPost.update({
    where: { id: postId },
    data: {
      likedByIds: updatedIds,
      likesCount: updatedIds.length,
    },
  });
}

export async function addComment(postId, authorId, content) {
  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) {
    const err = new Error('POST_NOT_FOUND');
    err.statusCode = 404;
    throw err;
  }

  return prisma.comment.create({
    data: {
      postId,
      authorId,
      content,
    },
    include: {
      author: {
        select: {
          id: true,
          role: true,
          profile: { select: { firstName: true, lastName: true, avatar: true } },
        },
      },
    },
  });
}
