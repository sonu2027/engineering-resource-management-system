import Assignment from "../models/assignment.model";
import UserModel from "../models/user.model";
import ProjectModel from "../models/project.model";
import { Request, Response } from "express";
import { RequestHandler } from "express";

export const createAssignment = async (req: Request, res: Response) => {
    const {
        engineerId,
        projectId,
        allocationPercentage,
        startDate,
        endDate,
        role,
    } = req.body;

    try {
        const engineer = await UserModel.findById(engineerId);
        if (!engineer || engineer.role !== "engineer") {
            res.status(404).json({ message: "Engineer not found" });
            return
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return
        }

        const currentAvailable =
            engineer.availableCapacity ?? engineer.maxCapacity ?? 100;

        if (allocationPercentage > currentAvailable) {
            res.status(400).json({
                message: `Engineer is over-allocated. Available capacity is ${currentAvailable}%.`,
            });
            return
        }

        const existingAssignment = await Assignment.findOne({ engineerId, projectId });
        if (existingAssignment) {
            res
                .status(400)
                .json({ message: "Engineer is already assigned to this project." });
            return
        }

        const assignment = await Assignment.create({
            engineerId,
            projectId,
            allocationPercentage,
            startDate,
            endDate,
            role,
        });

        engineer.availableCapacity = currentAvailable - allocationPercentage;
        await engineer.save();

        res.status(201).json({ assignment });
    } catch (err) {
        console.error("Assignment creation failed:", err);
        res.status(500).json({ message: "Failed to create assignment" });
    }
};

export const getAssignmentsByProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!projectId) {
        res.status(400).json({ message: "Project ID is required" });
    }

    try {
        const assignments = await Assignment.find({ projectId })
            .populate("engineerId", "name skills seniority maxCapacity department, email");

        res.status(200).json({ assignments });
    } catch (err) {
        console.error("Error fetching assignments:", err);
        res.status(500).json({ message: "Failed to fetch assignments for project" });
    }
};

export const deleteAssignment = async (req: Request, res: Response) => {
    const { assignmentId } = req.params;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            res.status(404).json({ message: "Assignment not found" });
            return
        }

        const engineer = await UserModel.findById(assignment.engineerId);
        const freedCapacity = assignment.allocationPercentage;

        await assignment.deleteOne();

        if (engineer?.availableCapacity !== undefined) {
            engineer.availableCapacity += freedCapacity;
            await engineer.save();
        }

        res.status(200).json({ message: "Assignment deleted" });
    } catch (err) {
        console.error("Delete assignment error:", err);
        res.status(500).json({ message: "Failed to delete assignment" });
    }
};
export const getAssignmentsByEngineer: RequestHandler = async (req: Request, res: Response) => {

    try {
        const engineerId = (req.query.engineerId as string) || (req as any).user?._id;
        if (!engineerId) {
            res.status(400).json({ message: "Engineer ID is required" });
            return
        }

        const engineer = await UserModel.findById(engineerId);
        if (!engineer || engineer.role !== "engineer") {
            res.status(404).json({ message: "Engineer not found or invalid role" });
            return
        }

        const assignments = await Assignment.find({ engineerId })
            .populate("projectId", "name description") 
            .sort({ startDate: 1 });

        res.status(200).json({ assignments });
    } catch (err) {
        console.error("Failed to fetch assignments:", err);
        res.status(500).json({ message: "Server error while fetching assignments" });
    }
};