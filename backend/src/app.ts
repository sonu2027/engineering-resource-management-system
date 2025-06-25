import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env", });
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser()); 

console.log("process.env.corsorigin: ", process.env.CORS_ORIGIN);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    // methods: "GET,POST,PUT,DELETE",
    // allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));

import authRouter from "./routes/auth.route";
app.use("/api/auth", authRouter);

import projectRouter from "./routes/project.route";
app.use("/api", projectRouter);

import userRouter from "./routes/user.route";
app.use("/api", userRouter);

import assignmentRouter from "./routes/assignment.route";
app.use("/api", assignmentRouter);

export default app;