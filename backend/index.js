//TODO:
// Do we want to remove users from like and wtf lists after we delete the user ?

require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const process = require("node:process");
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");
const commentRouter = require("./routers/comments");
const answerRouter = require("./routers/answer");
const connectDB = require("./database/connectDB");
const PORT = process.env.PORT || 3001;
const fileUpload = require("express-fileupload");
// USE V2
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const cookieParser = require("cookie-parser");
const cookieMiddleware = require("./middlewares/cookie-handler.js");

const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  const app = express();
  app.use(
    cors({
      origin: [
        "http://192.168.1.4:3000",
        "http://192.168.1.4:3001",
        "http://localhost:3001",
        "http://localhost:3000",
        "https://project-meme-frontend.vercel.app",
      ],
      credentials: true,
    })
  );
  app.use((req, res, next) => {
    res.set("server_id", process.pid);
    next();
  });
  app.get("/serverID", (req, res) => {
    res.status(200).json({ id: process.pid });
  });
  app.use(cookieParser(process.env.COOKIE_SIGN, { sameSite: "none" }));
  app.use(express.json());
  app.use(fileUpload({ useTempFiles: true }));

  app.use(cookieMiddleware);
  // app.get("/api/v1/config", (req, res) => res.json({ totalCPUs }));
  app.get("/api/v1", (req, res) => {
    res.send("Meme Project API");
  });
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/posts", postRouter);
  app.use("/api/v1/comments", commentRouter);
  app.use("/api/v1/answers", answerRouter);
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);
  const start = async (uri) => {
    try {
      await connectDB(uri);
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (err) {
      console.error(err);
    }
  };

  start(process.env.MONGO_URI);
}
