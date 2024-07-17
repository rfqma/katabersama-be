import { logger } from "../utils/logger";
import postModel from "../models/post.model";

export const getPostsFromDB = async () => {
  return await postModel
    .find()
    .then((posts) => {
      return posts;
    })
    .catch((error) => {
      logger.info("get posts from db failed");
      logger.error(error);
    });
};
