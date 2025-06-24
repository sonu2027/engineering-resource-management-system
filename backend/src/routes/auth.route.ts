import { Router } from "express";
import { loginUser, sendEmailVerificationOTP, signupUser } from "../controllers/auth.controller";
// import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const authRouter = Router();

authRouter.route("/signup").post(signupUser);
authRouter.route("/sendemailverificationotp").post(sendEmailVerificationOTP)
authRouter.route("/login").post(loginUser)

export default authRouter;
// router.route("/login").post(loginUser);
// router.route("/sendemailverificationotp").post(sendEmailVerificationOTP);
// router.route("/updateincome").put(verifyToken, updateIncome);
// router.route("/getincome").get(verifyToken, getIncome);
// router.route("/verifyemail").post(verifyEmail);
// router.route("/updatepassword").put(updatePassword);