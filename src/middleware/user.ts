import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

export const deserializeUserToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const accessToken = request.headers.authorization?.replace(/^Bearer\s/, "");

  if (!accessToken) {
    return next();
  }

  const { valid, expired, decoded } = verifyJWT(accessToken);

  if (decoded) {
    response.locals.user = decoded;
    return next();
  }

  if (expired) {
    return next();
  }

  return next();
};

export const UserRequired = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user = response.locals.user;

  if (!user) {
    return response.sendStatus(403);
  }

  return next();
};

export const AdminRequired = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user = response.locals.user;

  if (!user || user._doc.role !== "admin") {
    return response.sendStatus(403);
  }

  return next();
};
