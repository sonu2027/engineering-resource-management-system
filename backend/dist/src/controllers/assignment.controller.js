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
exports.getAssignmentsByEngineer = exports.deleteAssignment = exports.getAssignmentsByProject = exports.createAssignment = void 0;
const assignment_model_1 = __importDefault(require("../models/assignment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const createAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { engineerId, projectId, allocationPercentage, startDate, endDate, role, } = req.body;
    try {
        const engineer = yield user_model_1.default.findById(engineerId);
        if (!engineer || engineer.role !== "engineer") {
            res.status(404).json({ message: "Engineer not found" });
            return;
        }
        const project = yield project_model_1.default.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const currentAvailable = (_b = (_a = engineer.availableCapacity) !== null && _a !== void 0 ? _a : engineer.maxCapacity) !== null && _b !== void 0 ? _b : 100;
        if (allocationPercentage > currentAvailable) {
            res.status(400).json({
                message: `Engineer is over-allocated. Available capacity is ${currentAvailable}%.`,
            });
            return;
        }
        const existingAssignment = yield assignment_model_1.default.findOne({ engineerId, projectId });
        if (existingAssignment) {
            res
                .status(400)
                .json({ message: "Engineer is already assigned to this project." });
            return;
        }
        const assignment = yield assignment_model_1.default.create({
            engineerId,
            projectId,
            allocationPercentage,
            startDate,
            endDate,
            role,
        });
        engineer.availableCapacity = currentAvailable - allocationPercentage;
        yield engineer.save();
        res.status(201).json({ assignment });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create assignment" });
    }
});
exports.createAssignment = createAssignment;
const getAssignmentsByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    if (!projectId) {
        res.status(400).json({ message: "Project ID is required" });
    }
    try {
        const assignments = yield assignment_model_1.default.find({ projectId })
            .populate("engineerId", "name skills seniority maxCapacity department, email");
        res.status(200).json({ assignments });
    }
    catch (err) {
        console.error("Error fetching assignments:", err);
        res.status(500).json({ message: "Failed to fetch assignments for project" });
    }
});
exports.getAssignmentsByProject = getAssignmentsByProject;
const deleteAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assignmentId } = req.params;
    try {
        const assignment = yield assignment_model_1.default.findById(assignmentId);
        if (!assignment) {
            res.status(404).json({ message: "Assignment not found" });
            return;
        }
        const engineer = yield user_model_1.default.findById(assignment.engineerId);
        const freedCapacity = assignment.allocationPercentage;
        yield assignment.deleteOne();
        if ((engineer === null || engineer === void 0 ? void 0 : engineer.availableCapacity) !== undefined) {
            engineer.availableCapacity += freedCapacity;
            yield engineer.save();
        }
        res.status(200).json({ message: "Assignment deleted" });
    }
    catch (err) {
        console.error("Delete assignment error:", err);
        res.status(500).json({ message: "Failed to delete assignment" });
    }
});
exports.deleteAssignment = deleteAssignment;
const getAssignmentsByEngineer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const engineerId = req.query.engineerId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!engineerId) {
            res.status(400).json({ message: "Engineer ID is required" });
            return;
        }
        const engineer = yield user_model_1.default.findById(engineerId);
        if (!engineer || engineer.role !== "engineer") {
            res.status(404).json({ message: "Engineer not found or invalid role" });
            return;
        }
        const assignments = yield assignment_model_1.default.find({ engineerId })
            .populate("projectId", "name description")
            .sort({ startDate: 1 });
        res.status(200).json({ assignments });
    }
    catch (err) {
        console.error("Failed to fetch assignments:", err);
        res.status(500).json({ message: "Server error while fetching assignments" });
    }
});
exports.getAssignmentsByEngineer = getAssignmentsByEngineer;
