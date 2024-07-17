import Joi from "joi";

interface PostProps {
  slug: string;
  title: string;
  content: string;
}

export const createPostValidation = (payload: PostProps) => {
  const schema = Joi.object({
    slug: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    // content: Joi.string().allow('', null),
  });

  return schema.validate(payload);
};
