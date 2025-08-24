"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSpaceForProject = exports.deleteProject = exports.updateProject = exports.fetchProjects = exports.createProject = exports.getTeamLoad = exports.getAssignmentSummary = exports.getAssignmentTimeline = exports.getDashboardData = exports.getProjectWithAssignments = void 0;
const project_model_1 = __importDefault(require("../models/project.model"));
const assignment_model_1 = __importDefault(require("../models/assignment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const project_model_2 = __importDefault(require("../models/project.model"));
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, startDate, endDate, requiredSkills, teamSize, status, managerId, } = req.body;
        const newProject = yield project_model_1.default.create({
            name,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            requiredSkills,
            teamSize,
            status,
            managerId,
        });
        res.status(201).json({ message: "Project created successfully", project: newProject });
    }
    catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Failed to create project", error });
    }
});
exports.createProject = createProject;
const fetchProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { managerId } = req.query;
    if (!managerId || typeof managerId !== "string") {
        res.status(400).json({ message: "Missing or invalid managerId" });
        return;
    }
    try {
        const projects = yield project_model_1.default.find({ managerId }).sort({ createdAt: -1 });
        res.status(200).json({ projects });
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});
exports.fetchProjects = fetchProjects;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const updates = req.body;
    try {
        if (updates.status === "completed") {
            const assignments = yield assignment_model_1.default.find({ projectId: id });
            for (const assignment of assignments) {
                const engineer = yield user_model_1.default.findById(assignment.engineerId);
                if ((engineer === null || engineer === void 0 ? void 0 : engineer.availableCapacity) !== undefined) {
                    engineer.availableCapacity += assignment.allocationPercentage;
                    if (engineer.availableCapacity > ((_a = engineer.maxCapacity) !== null && _a !== void 0 ? _a : 100)) {
                        engineer.availableCapacity = (_b = engineer.maxCapacity) !== null && _b !== void 0 ? _b : 100;
                    }
                    yield engineer.save();
                }
            }
        }
        const updated = yield project_model_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json({ updatedProject: updated });
    }
    catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Failed to update project" });
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedProject = yield project_model_1.default.findByIdAndDelete(id);
        if (!deletedProject) {
            res.status(404).json({ message: "Project not found" });
        }
        const deletedAssignment = yield assignment_model_1.default.deleteMany({ projectId: id });
        console.log("deleted assignment: ", deletedAssignment);
        res.status(200).json({
            message: "Project and related assignments deleted successfully",
            deletedProject,
        });
    }
    catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Failed to delete project" });
    }
});
exports.deleteProject = deleteProject;
const getProjectWithAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield project_model_2.default.findById(req.params.id).lean();
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const assignments = yield assignment_model_1.default.find({ projectId: req.params.id })
            .populate("engineerId", "name email skills");
        res.status(200).json({ project, assignments });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch project detail" });
    }
});
exports.getProjectWithAssignments = getProjectWithAssignments;
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield assignment_model_1.default.find()
            .populate("engineerId", "name availableCapacity maxCapacity department")
            .populate("projectId", "name startDate endDate");
        const grouped = assignments.reduce((acc, a) => {
            const engineer = a.engineerId;
            if (!acc[engineer._id]) {
                acc[engineer._id] = {
                    engineerId: engineer._id,
                    name: engineer.name,
                    availableCapacity: engineer.availableCapacity,
                    maxCapacity: engineer.maxCapacity,
                    department: engineer.department,
                    assignments: [],
                };
            }
            acc[engineer._id].assignments.push({
                projectName: a.projectId.name,
                projectStart: a.projectId.startDate,
                projectEnd: a.projectId.endDate,
                allocationPercentage: a.allocationPercentage,
                role: a.role,
                startDate: a.startDate,
                endDate: a.endDate,
            });
            return acc;
        }, {});
        res.status(200).json({ data: Object.values(grouped) });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to load dashboard data" });
    }
});
exports.getDashboardData = getDashboardData;
const getAssignmentTimeline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timelineData = yield assignment_model_1.default.find()
            .populate("engineerId", "name")
            .populate("projectId", "name")
            .select("startDate endDate role allocationPercentage engineerId projectId");
        const formatted = timelineData.map((a) => ({
            engineer: a.engineerId.name,
            project: a.projectId.name,
            startDate: a.startDate,
            endDate: a.endDate,
            role: a.role,
            allocation: a.allocationPercentage,
        }));
        res.status(200).json({ timeline: formatted });
    }
    catch (err) {
        console.error("Timeline fetch failed:", err);
        res.status(500).json({ message: "Failed to fetch timeline data" });
    }
});
exports.getAssignmentTimeline = getAssignmentTimeline;
const getAssignmentSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield assignment_model_1.default.find()
            .populate("engineerId", "name email department")
            .populate("projectId", "name status");
        const summary = assignments.map((a) => {
            const engineer = a.engineerId;
            const project = a.projectId;
            return {
                id: a._id,
                engineer: engineer.name,
                email: engineer.email,
                department: engineer.department,
                project: project.name,
                status: project.status,
                role: a.role,
                allocation: a.allocationPercentage,
                startDate: a.startDate,
                endDate: a.endDate,
            };
        });
        res.status(200).json({ summary });
    }
    catch (err) {
        console.error("Error generating summary:", err);
        res.status(500).json({ message: "Failed to fetch summary data" });
    }
});
exports.getAssignmentSummary = getAssignmentSummary;
const getTeamLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const engineers = yield user_model_1.default.find({ role: "engineer" });
        const loadMap = yield Promise.all(engineers.map((eng) => __awaiter(void 0, void 0, void 0, function* () {
            const assignments = yield assignment_model_1.default.find({ engineerId: eng._id });
            const totalAllocated = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
            return {
                name: eng.name,
                department: eng.department || "Unassigned",
                maxCapacity: eng.maxCapacity || 100,
                used: totalAllocated,
                available: (eng.maxCapacity || 100) - totalAllocated,
            };
        })));
        res.status(200).json({ team: loadMap });
    }
    catch (err) {
        res.status(500).json({ message: "Team load fetch failed" });
    }
});
exports.getTeamLoad = getTeamLoad;
// check how many engineer assign on the project
const checkSpaceForProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            res.status(400).json({ message: "projectId is required" });
            return;
        }
        const project = yield project_model_1.default.findOne({ _id: projectId });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const assignments = yield assignment_model_1.default.find({ projectId });
        const assignedCount = assignments.length;
        const teamSize = project.teamSize;
        const spaceAvailable = assignedCount < teamSize;
        res.status(200).json({
            spaceAvailable,
            message: spaceAvailable
                ? "Space is available for engineer"
                : "No space available for engineer",
        });
    }
    catch (error) {
        console.error("Error checking project space:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.checkSpaceForProject = checkSpaceForProject;
