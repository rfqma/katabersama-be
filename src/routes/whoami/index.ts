import { Router, Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";

export const WhoAmIRouter: Router = Router();

WhoAmIRouter.get(
  "/",
  (request: Request, response: Response, next: NextFunction) => {
    logger.info("get /whoami success")
    response.status(200).send({
      status: true,
      code: 200,
      message: "success",
      data: { name: "Rifqi Maulana", web: "https://rfqma.xyz" },
    });
  }
);
