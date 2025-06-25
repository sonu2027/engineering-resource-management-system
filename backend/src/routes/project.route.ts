import { Router } from "express";
import { createProject, fetchProjects, updateProject, deleteProject } from "../controllers/project.controller";
import { verifyToken } from "../middleware/verifyToken.middleware";

const projectRouter = Router();

projectRouter.route("/projects").post(verifyToken, createProject);
projectRouter.route("/projects").get(verifyToken, fetchProjects);
projectRouter.patch("/projects/:id", verifyToken, updateProject);
projectRouter.delete("/projects/:id", verifyToken, deleteProject);


export default projectRouter;

// authRouter.route("/sendemailverificationotp").post(sendEmailVerificationOTP)
// authRouter.route("/login").post(loginUser)
// router.route("/login").post(loginUser);
// router.route("/sendemailverificationotp").post(sendEmailVerificationOTP);
// router.route("/updateincome").put(verifyToken, updateIncome);
// router.route("/getincome").get(verifyToken, getIncome);
// router.route("/verifyemail").post(verifyEmail);
// router.route("/updatepassword").put(updatePassword);