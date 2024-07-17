import { Request, Response } from "express";
import { createPostValidation } from "../validations/post.validation";
import { logger } from "../utils/logger";
import { getPostsFromDB } from "../services/post.service";

interface PostProps {
  post_id: string;
  slug: string;
  title: string;
  content: string;
}

export const createPost = (request: Request, response: Response) => {
  const { error, value } = createPostValidation(request.body);

  if (error) {
    logger.error("ERR: product - create = ", error.details[0].message);
    return response.status(422).send({
      status: false,
      code: 422,
      message: error.details[0].message,
      data: {},
    });
  }

  logger.info("add /posts success");
  return response.status(201).send({
    status: true,
    code: 201,
    message: "success",
    data: value,
  });
};

export const getPosts = async (request: Request, response: Response) => {
  const posts: any = await getPostsFromDB();

  const {
    params: { slug },
  } = request;

  if (slug) {
    const filterPosts = posts.filter((post: PostProps) => {
      if (post.slug === slug) {
        return post;
      }
    });

    if (filterPosts.length === 0) {
      logger.info("get /posts/:slug failed, post not found");
      return response.status(404).send({
        status: false,
        code: 404,
        message: "failed",
        data: {},
      });
    }

    logger.info("get /posts/:slug success");
    return response.status(200).send({
      status: true,
      code: 200,
      message: "success",
      data: filterPosts[0],
    });
  }

  logger.info("get /posts success");
  return response.status(200).send({
    status: true,
    code: 200,
    message: "success",
    data: posts,
  });
};
