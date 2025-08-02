"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignment_controller_1 = require("../controllers/assignment.controller");
const verifyToken_middleware_1 = require("../middleware/verifyToken.middleware");
const assignmentRouter = express_1.default.Router();
assignmentRouter.post("/assignments", verifyToken_middleware_1.verifyToken, assignment_controller_1.createAssignment);
assignmentRouter.get("/assignments/:projectId", verifyToken_middleware_1.verifyToken, assignment_controller_1.getAssignmentsByProject);
assignmentRouter.delete("/assignments/:assignmentId", verifyToken_middleware_1.verifyToken, assignment_controller_1.deleteAssignment);
assignmentRouter.get("/assignments", verifyToken_middleware_1.verifyToken, assignment_controller_1.getAssignmentsByEngineer);
exports.default = assignmentRouter;
