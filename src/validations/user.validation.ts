import Joi from "joi";
import UserProps from "../utils/types/user.type";

export const createUserValidation = (payload: UserProps) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().lowercase().required(),
    password: Joi.string().required(),
    name: Joi.string()
      .regex(/^[a-zA-Z ]*$/)
      .required(),
    role: Joi.string().allow("", null),
  });

  return schema.validate(payload);
};

export const createUserSessionValidation = (payload: UserProps) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(payload);
};

export const createUserRefreshSessionValidation = (payload: UserProps) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });

  return schema.validate(payload);
};
