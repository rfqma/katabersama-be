import { Application, Router } from "express";
import { HelloWorldRouter } from "./hello-world";
import { WorldHelloRouter } from "./world-hello";
import { WhoAmIRouter } from "./whoami";
import { PostsRouter } from "./post.route";

const _routes: Array<[string, Router]> = [
  ["/hello-world", HelloWorldRouter],
  ["/world-hello", WorldHelloRouter],
  ["/whoami", WhoAmIRouter],
  ["/posts", PostsRouter],
];

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route;
    app.use(url, router);
  });
};
