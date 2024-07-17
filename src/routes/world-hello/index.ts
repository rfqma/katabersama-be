import { Router, Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";

export const WorldHelloRouter: Router = Router();

WorldHelloRouter.get(
  "/",
  (request: Request, response: Response, next: NextFunction) => {
    logger.info("get /world-hello success")
    response
      .status(200)
      .send({
        status: true,
        code: 200,
        message: "success",
        data: "World Hello",
      });
  }
);
