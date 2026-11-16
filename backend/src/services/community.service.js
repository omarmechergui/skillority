import prisma from '../config/database.js';

export async function listPosts({ tag, search, page = 1, limit = 10 }) {
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
      skip: (page - 1) * limit,
      take: limit,
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

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
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
