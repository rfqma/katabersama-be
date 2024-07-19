import Joi from "joi";
import PostProps from "../utils/types/post.type";

export const createPostValidation = (payload: PostProps) => {
  const schema = Joi.object({
    post_id: Joi.string().required(),
    slug: Joi.string()
      .regex(/^[a-z0-9-]*$/)
      .required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    content: Joi.string().required(),
    thumbnail: Joi.string().required(),
    author: Joi.object({
      user_id: Joi.string().required(),
      name: Joi.string().required(),
      username: Joi.string().required(),
    }),
  });

  return schema.validate(payload);
};

export const updatePostValidation = (payload: PostProps) => {
  const schema = Joi.object({
    slug: Joi.string()
      .regex(/^[a-z0-9-]*$/)
      .required(),
    title: Joi.string().allow("", null),
    description: Joi.string().allow("", null),
    content: Joi.string().allow("", null),
    thumbnail: Joi.string().allow("", null),
  });

  return schema.validate(payload);
};
