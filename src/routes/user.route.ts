import { Router } from "express";
import {
  createUser,
  createUserSession,
  createUserRefreshSession,
  getUsers,
} from "../controllers/user.controller";
import { AdminRequired, UserRequired } from "../middleware/user";

export const UsersRouter: Router = Router();

UsersRouter.post("/", createUser);
UsersRouter.post("/session", createUserSession);
UsersRouter.post("/session/refresh", UserRequired, createUserRefreshSession);
UsersRouter.get("/", AdminRequired, getUsers);
