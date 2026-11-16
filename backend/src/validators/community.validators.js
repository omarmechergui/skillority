import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000),
  tags: z.array(z.string()).default([]),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
});
