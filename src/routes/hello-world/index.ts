import { Router, Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";

export const HelloWorldRouter: Router = Router();

HelloWorldRouter.get(
  "/",
  (request: Request, response: Response, next: NextFunction) => {
    logger.info("get /hello-world success")
    response
      .status(200)
      .send({
        status: true,
        code: 200,
        message: "success",
        data: "Hello World",
      });
  }
);
