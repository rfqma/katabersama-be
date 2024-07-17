import { Router } from "express";
import { createPost, getPosts } from "../controllers/post.controller";

export const PostsRouter: Router = Router();

PostsRouter.get("/", getPosts);
PostsRouter.get("/:slug", getPosts);
PostsRouter.post("/", createPost);
