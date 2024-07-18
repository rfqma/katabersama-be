import express, { Application } from "express";
import { routes } from "./routes";
import { logger } from "./utils/logger";
import bodyParser from "body-parser";
import cors from "cors";
import { deserializeUserToken } from "./middleware/user";

//connect db
import "./utils/database";

const app: Application = express();
const port: number = 4000;

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

routes(app);

app.listen(port, () => logger.info(`server is listening on port ${port}`));
