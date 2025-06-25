import { Router } from "express";
import { createProject, fetchProjects, updateProject, deleteProject, getProjectWithAssignments, getAssignmentTimeline, getAssignmentSummary, getTeamLoad } from "../controllers/project.controller";
import { verifyToken } from "../middleware/verifyToken.middleware";

const projectRouter = Router();

projectRouter.route("/projects").post(verifyToken, createProject);
projectRouter.route("/projects").get(verifyToken, fetchProjects);
projectRouter.patch("/projects/:id", verifyToken, updateProject);
projectRouter.delete("/projects/:id", verifyToken, deleteProject);
projectRouter.get("/projects/:id/full", verifyToken, getProjectWithAssignments);
projectRouter.get("/analytics/assignment-timeline", verifyToken, getAssignmentTimeline);
projectRouter.get("/analytics/assignment-summary", verifyToken, getAssignmentSummary);
projectRouter.get("/analytics/team-load", verifyToken, getTeamLoad);

export default projectRouter;
