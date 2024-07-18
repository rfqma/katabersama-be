import { Request, Response } from "express";
import {
  createUserValidation,
  createUserSessionValidation,
  createUserRefreshSessionValidation,
} from "../validations/user.validation";
import { logger } from "../utils/logger";
import {
  createUserToDB,
  getUsersFromDB,
  getUserByEmailFromDB,
  getUserByUsernameFromDB,
} from "../services/user.service";
import { v4 as uuidv4 } from "uuid";
import { decode, encode } from "../utils/hash";
import UserProps from "../utils/types/user.type";
import { assignJWT, reassignJWT } from "../utils/jwt";

export const createUser = async (request: Request, response: Response) => {
  request.body.user_id = uuidv4();

  const { error, value } = createUserValidation(request.body);
  if (error) {
    logger.error("create /users failed = ", error.details[0].message);
    return response.status(422).send({
      status: false,
      code: 422,
      message: `failed, ${error.details[0].message}`,
      data: {},
    });
  }

  try {
    const isEmailExist = await getUserByEmailFromDB(value.email);
    const isUsernameExist = await getUserByUsernameFromDB(value.username);

    if (isEmailExist || isUsernameExist) {
      logger.error("create /users failed = email or username already exist");
      return response.status(409).send({
        status: false,
        code: 409,
        message: `failed duplicate error, email or username already exist`,
        data: {},
      });
    }

    if (!isEmailExist && !isUsernameExist) {
      const hashedPassword = `${encode(value.password)}`;

      const finalValue = {
        ...value,
        password: hashedPassword,
      };

      await createUserToDB(finalValue);

      logger.info("create /users success");
      return response.status(201).send({
        status: true,
        code: 201,
        message: "success, user created",
        data: {
          user_id: finalValue.user_id,
          email: finalValue.email,
          username: finalValue.username,
          name: finalValue.name,
          role: finalValue.role,
        },
      });
    }
  } catch (error) {
    logger.error("create /users failed = ", error);
    return response.status(422).send({
      status: false,
      code: 422,
      message: `failed, ${error}`,
      data: {},
    });
  }
};

export const createUserSession = async (
  request: Request,
  response: Response
) => {
  const { error, value } = createUserSessionValidation(request.body);
  if (error) {
    logger.error("create /users/session failed = ", error.details[0].message);
    return response.status(400).send({
      status: false,
      code: 400,
      message: `failed, ${error.details[0].message}`,
      data: {},
    });
  }

  try {
    const user: UserProps | null = await getUserByUsernameFromDB(
      value.username
    );

    if (!user) {
      logger.error("create /users/session failed = username not found");
      return response.status(404).send({
        status: false,
        code: 404,
        message: "failed, username not found",
        data: {},
      });
    }

    const isPasswordValid = decode(value.password, user.password);

    if (!isPasswordValid) {
      logger.error("create /users/session failed = invalid credentials");
      return response.status(401).send({
        status: false,
        code: 401,
        message: `failed, invalid credentials`,
        data: {},
      });
    }

    const accessToken = assignJWT({ ...user }, { expiresIn: "1d" });
    const refreshToken = assignJWT({ ...user }, { expiresIn: "1y" });

    logger.info("create /users/session success");
    return response.status(200).send({
      status: true,
      code: 200,
      message: "success, user session created",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    logger.error("create /users/session failed = ", error);
    return response.status(401).send({
      status: false,
      code: 401,
      message: `failed, ${error}`,
      data: {},
    });
  }
};

export const createUserRefreshSession = async (
  request: Request,
  response: Response
) => {
  const { error, value } = createUserRefreshSessionValidation(request.body);
  if (error) {
    logger.error(
      "create /users/session/refresh failed = ",
      error.details[0].message
    );
    return response.status(400).send({
      status: false,
      code: 400,
      message: `failed, ${error.details[0].message}`,
      data: {},
    });
  }

  try {
    const accessToken = await reassignJWT(value.refreshToken);

    if (accessToken !== null) {
      logger.info("create /users/session/refresh success");
      return response.status(200).send({
        status: true,
        code: 200,
        message: "success, user session refresh created",
        data: { accessToken },
      });
    }
  } catch (error) {
    logger.error("create /users/session/refresh failed = ", error);
    return response.status(401).send({
      status: false,
      code: 401,
      message: `failed, ${error}`,
      data: {},
    });
  }
};

export const getUsers = async (request: Request, response: Response) => {
  const users: any = await getUsersFromDB();

  if (users.length === 0) {
    logger.info("get /users success = users is empty");
    return response.status(404).send({
      status: true,
      code: 404,
      message: "users is empty",
      data: [],
    });
  }

  logger.info("get /users success");
  return response.status(200).send({
    status: true,
    code: 200,
    message: `success, ${users.length} users found`,
    data: users,
  });
};
