import { logger } from "../utils/logger";
import postModel from "../models/post.model";
import PostProps from "../utils/types/post.type";

export const createPostToDB = async (payload: PostProps) => {
  return await postModel.create(payload);
};

export const getPostsFromDB = async () => {
  return await postModel
    .find()
    .then((posts) => {
      return posts;
    })
    .catch((error) => {
      logger.error(`get posts from db failed = ${error}`);
    });
};

export const getPostByIdFromDB = async (post_id: string) => {
  return await postModel.findOne({ post_id: post_id });
};

export const getPostBySlugFromDB = async (slug: string) => {
  return await postModel.findOne({ slug: slug });
};

export const updatePostByIdToDB = async (
  post_id: string,
  payload: PostProps
) => {
  const results = await postModel.findOneAndUpdate(
    {
      post_id: post_id,
    },
    {
      $set: payload,
    }
  );
  return results;
};

export const deletePostByIdFromDB = async (post_id: string) => {
  const results = await postModel.findOneAndDelete({ post_id: post_id });
  return results;
};
