import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../validators/auth.validators.js';
import { createPostSchema, createCommentSchema } from '../validators/community.validators.js';
import {
  listPosts,
  getPost,
  createPost,
  toggleLike,
  addComment,
} from '../controllers/community.controller.js';

const router = Router();

router.get('/posts', listPosts);
router.get('/posts/:id', getPost);
router.post('/posts', requireAuth, validate(createPostSchema), createPost);
router.post('/posts/:id/like', requireAuth, toggleLike);
router.post('/posts/:id/comments', requireAuth, validate(createCommentSchema), addComment);

export default router;
