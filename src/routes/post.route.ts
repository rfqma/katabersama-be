import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  updatePostById,
  deletePostById,
} from "../controllers/post.controller";
import { UserRequired } from "../middleware/user";

export const PostsRouter: Router = Router();

PostsRouter.post("/", UserRequired, createPost);
PostsRouter.get("/", getPosts);
PostsRouter.get("/:post_id", getPostById);
PostsRouter.get("/slug/:slug", getPostBySlug);
PostsRouter.put("/:post_id", UserRequired, updatePostById);
PostsRouter.delete("/:post_id", UserRequired, deletePostById);
