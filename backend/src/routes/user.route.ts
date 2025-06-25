import express from "express";
import { getAllEngineers, getEngineerById, updateEngineerProfile,  } from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken.middleware";

const userRouter = express.Router();

userRouter.get("/engineers", verifyToken, getAllEngineers);
userRouter.get("/engineer/profile/:userId", verifyToken, getEngineerById);
userRouter.put("/engineer/updateprofile/:userId", verifyToken, updateEngineerProfile);

export default userRouter;
