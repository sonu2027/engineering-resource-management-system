import dotenv from "dotenv";
import connectDB from "./src/connectDB";
import app from "./src/app";
import { Request, Response } from "express";

dotenv.config({ path: "./.env", });

const port = process.env.PORT

connectDB()
  .then(() => {
    app.get("/", (req: Request, res: Response) => {
      res.send(
        `<h1>Server is running at http://localhost:${process.env.PORT}</h1>`
      );
    });

    app.listen(port || 7000, () => {
      console.log(
        `⚙️ Server is running at http://localhost:${process.env.PORT} || 7000`
      );
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });