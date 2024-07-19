import { Request, Response } from "express";
import {
  createPostValidation,
  updatePostValidation,
} from "../validations/post.validation";
import { logger } from "../utils/logger";
import {
  createPostToDB,
  getPostsFromDB,
  getPostByIdFromDB,
  getPostBySlugFromDB,
  updatePostByIdToDB,
  deletePostByIdFromDB,
} from "../services/post.service";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../utils/s3";
import CONFIG from "../config/env";
import slug from "slug";

export const createPost = async (request: Request, response: Response) => {
  const user = response.locals.user;

  request.body.post_id = uuidv4();
  request.body.slug = `${slug(request.body.title, { lower: true })}-${
    user._doc.username
  }`;
  request.body.author = {
    user_id: user._doc.user_id,
    name: user._doc.name,
    username: user._doc.username,
  };

  //upload thumbnail
  const file = (request.files as { [key: string]: any })["thumbnail"] || null;
  if (!file) {
    return response.sendStatus(422);
  }

  const { name, mimetype, size, data } = file;
  const fileContent = Buffer.from(data, "binary");

  try {
    await s3
      .putObject({
        Body: fileContent,
        Bucket: "katabersama-bucket",
        Key: `${user._doc.username}-${request.body.slug}-${name}`,
        ContentType: mimetype,
        ContentDisposition: "inline",
      })
      .promise();

    request.body.thumbnail = `${CONFIG.CONTABO_STORAGE_BUCKET_URL_PUBLIC}/${user._doc.username}-${request.body.slug}-${name}`;
    // end of upload thumbnail

    const { error, value } = createPostValidation(request.body);
    if (error) {
      logger.error("create /posts failed = ", error.details[0].message);
      return response.status(422).send({
        status: false,
        code: 422,
        message: `failed, ${error.details[0].message}`,
        data: {},
      });
    }

    await createPostToDB(value);

    logger.info("create /posts success");
    return response.status(201).send({
      status: true,
      code: 201,
      message: "success, post created",
      data: value,
    });
  } catch (error) {
    logger.error("create /posts failed = ", error);
    return response.status(500).send({
      status: false,
      code: 500,
      message: error,
      data: {},
    });
  }
};

export const getPosts = async (request: Request, response: Response) => {
  const posts: any = await getPostsFromDB();

  if (posts.length === 0) {
    logger.info("get /posts success = posts is empty");
    return response.status(404).send({
      status: true,
      code: 404,
      message: "posts is empty",
      data: [],
    });
  }

  logger.info("get /posts success");
  return response.status(200).send({
    status: true,
    code: 200,
    message: `success, ${posts.length} posts found`,
    data: posts,
  });
};

export const getPostById = async (request: Request, response: Response) => {
  const {
    params: { post_id },
  } = request;

  if (post_id) {
    const postById = await getPostByIdFromDB(post_id);

    if (postById) {
      logger.info("get /posts/:post_id success");
      return response.status(200).send({
        status: true,
        code: 200,
        message: "success",
        data: postById,
      });
    } else {
      logger.error("get /posts/:post_id data not found");
      return response.status(404).send({
        status: true,
        code: 404,
        message: `data not found with post_id='${post_id}'`,
        data: {},
      });
    }
  } else {
    const posts: any = await getPostsFromDB();

    if (posts.length === 0) {
      logger.info("get /posts success = posts is empty");
      return response.status(404).send({
        status: true,
        code: 404,
        message: "posts is empty",
        data: [],
      });
    }

    logger.info("get /posts success");
    return response.status(200).send({
      status: true,
      code: 200,
      message: `success, ${posts.length} posts found`,
      data: posts,
    });
  }
};

export const getPostBySlug = async (request: Request, response: Response) => {
  const {
    params: { slug },
  } = request;

  if (slug) {
    const postBySlug = await getPostBySlugFromDB(slug);

    if (postBySlug) {
      logger.info("get /posts/slug/:slug success");
      return response.status(200).send({
        status: true,
        code: 200,
        message: "success",
        data: postBySlug,
      });
    } else {
      logger.error("get /posts/slug/:slug data not found");
      return response.status(404).send({
        status: true,
        code: 404,
        message: `data not found with slug='${slug}'`,
        data: {},
      });
    }
  } else {
    const posts: any = await getPostsFromDB();

    if (posts.length === 0) {
      logger.info("get /posts success = posts is empty");
      return response.status(404).send({
        status: true,
        code: 404,
        message: "posts is empty",
        data: [],
      });
    }

    logger.info("get /posts success");
    return response.status(200).send({
      status: true,
      code: 200,
      message: `success, ${posts.length} posts found`,
      data: posts,
    });
  }
};

export const updatePostById = async (request: Request, response: Response) => {
  const {
    params: { post_id },
  } = request;

  const user = response.locals.user;
  const updatePostRequestedBy = user._doc.user_id;

  const postById = await getPostByIdFromDB(post_id);

  if (postById?.author?.user_id !== updatePostRequestedBy) {
    logger.error("update /posts/:post_id failed = user not allowed");
    return response.status(401).send({
      status: false,
      code: 401,
      message: "failed, user not allowed",
      data: {},
    });
  }

  request.body.slug = `${slug(request.body.title, { lower: true })}-${
    user._doc.username
  }`;

  const { error, value } = updatePostValidation(request.body);
  if (error) {
    logger.error("update /posts/:post_id failed = ", error.details[0].message);
    return response.status(422).send({
      status: false,
      code: 422,
      message: `failed, ${error.details[0].message}`,
      data: {},
    });
  }

  try {
    const results = await updatePostByIdToDB(post_id, value);

    if (results !== null) {
      logger.info("update /posts/:post_id success");
      return response.status(200).send({
        status: true,
        code: 200,
        message: "success, post updated",
        data: value,
      });
    } else {
      logger.info("update /posts/:post_id data not found");
      return response.status(404).send({
        status: true,
        code: 404,
        message: `data not found with post_id='${post_id}'`,
        data: {},
      });
    }
  } catch (error) {
    logger.error("update /posts/:post_id failed = ", error);
    return response.status(422).send({
      status: false,
      code: 422,
      message: `failed, ${error}`,
      data: {},
    });
  }
};

export const deletePostById = async (request: Request, response: Response) => {
  const {
    params: { post_id },
  } = request;

  const user = response.locals.user;
  const deletePostRequestedBy = user._doc.user_id;

  const postById = await getPostByIdFromDB(post_id);

  if (postById?.author?.user_id !== deletePostRequestedBy) {
    logger.error("delete /posts/:post_id failed = user not allowed");
    return response.status(401).send({
      status: false,
      code: 401,
      message: "failed, user not allowed",
      data: {},
    });
  }

  try {
    const results = await deletePostByIdFromDB(post_id);

    if (results !== null) {
      logger.info("delete /posts/:post_id success");
      return response.status(200).send({
        status: true,
        code: 200,
        message: "success, post deleted",
        data: {},
      });
    } else {
      logger.info("delete /posts/:post_id data not found");
      return response.status(404).send({
        status: true,
        code: 404,
        message: `data not found with post_id='${post_id}'`,
        data: {},
      });
    }
  } catch (error) {
    logger.error("delete /posts/:post_id failed = ", error);
    return response.status(404).send({
      status: false,
      code: 404,
      message: `failed, ${error}`,
      data: {},
    });
  }
};
