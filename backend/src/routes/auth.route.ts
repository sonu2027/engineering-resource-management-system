import { Router } from "express";
import { loginUser, sendEmailVerificationOTP, signupUser } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/signup").post(signupUser);
authRouter.route("/sendemailverificationotp").post(sendEmailVerificationOTP)
authRouter.route("/login").post(loginUser)

export default authRouter;