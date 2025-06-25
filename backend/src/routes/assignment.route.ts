import express from "express";
import { createAssignment, deleteAssignment, getAssignmentsByProject } from "../controllers/assignment.controller";
import { verifyToken } from "../middleware/verifyToken.middleware";

const assignmentRouter = express.Router();

assignmentRouter.post("/assignments", verifyToken, createAssignment);
assignmentRouter.get("/assignments/:projectId", verifyToken, getAssignmentsByProject);
assignmentRouter.delete("/assignments/:assignmentId", verifyToken, deleteAssignment);

export default assignmentRouter;
