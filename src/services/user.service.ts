import { logger } from "../utils/logger";
import userModel from "../models/user.model";
import UserProps from "../utils/types/user.type";

export const createUserToDB = async (payload: UserProps) => {
  return await userModel.create(payload);
};

export const getUsersFromDB = async () => {
  return await userModel
    .find()
    .then((users) => {
      return users;
    })
    .catch((error) => {
      logger.error(`get users from db failed = ${error}`);
    });
};

export const getUserByIdFromDB = async (user_id: string) => {
  return await userModel.findOne({ user_id: user_id });
};

export const getUserByEmailFromDB = async (email: string) => {
  return await userModel.findOne({ email: email });
};

export const getUserByUsernameFromDB = async (username: string) => {
  return await userModel.findOne({ username: username });
};
