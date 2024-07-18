import mongoose from "mongoose";
import CONFIG from "../config/env";
import { logger } from "./logger";

mongoose
  .connect(`${CONFIG.MONGODB_URL}`)
  .then(() => {
    logger.info("connected to mongodb");
  })
  .catch((error) => {
    logger.error(`error connecting to mongodb = ${error}`);
    process.exit(1);
  });
