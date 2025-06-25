import express from "express";
import { getAllEngineers } from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken.middleware";

const userRouter = express.Router();

userRouter.get("/engineers", verifyToken, getAllEngineers);

export default userRouter;
