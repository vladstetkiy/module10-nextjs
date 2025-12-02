import { z } from 'zod';

export const LikeSchema = z.object({
  id: z.number(),
  postId: z.number(),
  userId: z.number(),
  creationDate: z.string(),
});
export type LikeInterface = z.infer<typeof LikeSchema>;
export const validateLike = (data: unknown): LikeInterface => LikeSchema.parse(data);

export const CommentSchema = z.object({
  id: z.number(),
  text: z.string(),
  authorId: z.number(),
  postId: z.number(),
  creationDate: z.string(),
  modifiedDate: z.string(),
});
export type CommentInterface = z.infer<typeof CommentSchema>;
export const validateComment = (data: unknown): CommentInterface => CommentSchema.parse(data);

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().optional(),
  profileImage: z.string().optional(),
  bio: z.string().optional(),
  firstName: z.string().optional(),
  secondName: z.string().optional(),
  description: z.string(),
  lastLogin: z.string(),
  creationDate: z.string(),
  modifiedDate: z.string(),
});
export type UserInterface = z.infer<typeof UserSchema>;
export const validateUser = (data: unknown): UserInterface => UserSchema.parse(data);

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  authorId: z.number(),
  image: z.string().optional(),
  creationDate: z.string(),
  likesCount: z.number(),
  modifiedDate: z.string(),
  commentsCount: z.number(),
  likedByUsers: z.array(UserSchema).optional(),
});
export type PostInterface = z.infer<typeof PostSchema>;
export const validatePost = (data: unknown): PostInterface => PostSchema.parse(data);

export const GroupSchema = z.object({
  id: z.number(),
  title: z.string(),
  photo: z.string(),
  membersCount: z.number(),
});

export type GroupInterface = z.infer<typeof GroupSchema>;
export const validateGroup = (data: unknown): GroupInterface => GroupSchema.parse(data);
