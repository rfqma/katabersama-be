import { Application, Router } from "express";
import { HelloWorldRouter } from "./hello-world";
import { WhoAmIRouter } from "./whoami";
import { PostsRouter } from "./post.route";
import { UsersRouter } from "./user.route";

const _routes: Array<[string, Router]> = [
  ["/hello-world", HelloWorldRouter],
  ["/whoami", WhoAmIRouter],
  ["/posts", PostsRouter],
  ["/users", UsersRouter],
];

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route;
    app.use(url, router);
  });
};
