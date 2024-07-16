import express, {Application, NextFunction, Request, Response} from 'express'

const app: Application = express()
const port: number = 4000

app.use("/", (request: Request, response: Response, next: NextFunction) => {
  response.status(200).send({code: 200, message: "success", data: "Hello World"})
})

app.listen(port, () => console.log(`🚀 server is listening on port ${port}`))