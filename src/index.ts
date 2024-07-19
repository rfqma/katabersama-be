import express, { Application } from "express";
import { routes } from "./routes";
import { logger } from "./utils/logger";
import bodyParser from "body-parser";
import cors from "cors";
import { deserializeUserToken } from "./middleware/user";
import fileUpload from "express-fileupload";
import { s3 } from "./utils/s3";

//connect db
import "./utils/database";

const app: Application = express();
const port: number = 4001;

//parse body request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors access handler
app.use(cors());
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

//check accessToken
app.use(deserializeUserToken);

//handle incoming file
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//connect to s3
s3;

routes(app);

app.listen(port, () => logger.info(`server is listening on port ${port}`));
