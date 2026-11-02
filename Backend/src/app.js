import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

// Convert incoming JSON into a JavaScript object in req.body.
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// All routes in userRouter begin with this path.
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export default app;