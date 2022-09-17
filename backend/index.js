//TODO:
// Add likes and wtfs
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./database/connectDB");
const PORT = process.env.PORT || 3000;

const userRouter = require("./routers/user");
const postRouter = require("./routers/post");
const commentRouter = require("./routers/comments");
const answerRouter = require("./routers/answer");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const cookieParser = require("cookie-parser");

app.get("/", (req, res) => {
  res.send("Meme Project API");
});
app.use(cookieParser(process.env.COOKIE_SIGN));
app.use(express.json());
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
