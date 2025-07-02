import { Router } from "express";
import { changePassword, checkCookie, loginUser, logoutUser, sendEmailVerificationOTP, signupUser, updatePassword, verifyEmail } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken.middleware";

const authRouter = Router();

authRouter.route("/signup").post(signupUser);
authRouter.route("/sendemailverificationotp").post(sendEmailVerificationOTP)
authRouter.route("/login").post(loginUser)
authRouter.put("/change-password", verifyToken, changePassword);
authRouter.post("/verifyemail", verifyEmail);
authRouter.post("/update-password", updatePassword);
authRouter.post("/logout",verifyToken, logoutUser);
authRouter.get("/check-cookie", checkCookie);

export default authRouter;