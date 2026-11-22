import * as communityService from '../services/community.service.js';

export async function listPosts(req, res, next) {
  try {
    const { tag, search, page, limit } = req.query;
    const result = await communityService.listPosts({
      tag,
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return res.status(200).json({ success: true, data: result.posts, meta: result });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await communityService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const post = await communityService.createPost(req.user.id, req.validatedBody);
    return res.status(201).json({ success: true, message: 'Post created', data: post });
  } catch (err) {
    next(err);
  }
}

export async function toggleLike(req, res, next) {
  try {
    const post = await communityService.togglePostLike(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Like status updated', data: { likesCount: post.likesCount } });
  } catch (err) {
    if (err.message === 'POST_NOT_FOUND') return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: err.message } });
    next(err);
  }
}

export async function addComment(req, res, next) {
  try {
    const comment = await communityService.addComment(req.params.id, req.user.id, req.validatedBody.content);
    return res.status(201).json({ success: true, message: 'Comment added', data: comment });
  } catch (err) {
    if (err.message === 'POST_NOT_FOUND' || err.statusCode === 404) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
    }
    next(err);
  }
}
