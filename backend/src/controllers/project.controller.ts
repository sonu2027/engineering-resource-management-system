import Project from "../models/project.model";
import { Request, Response } from "express";
import Assignment from "../models/assignment.model";
import UserModel from "../models/user.model";
import ProjectModel from "../models/project.model";
import { IUser } from "../models/user.model";
import { IProject } from "../models/project.model";
import { deleteAssignment } from "./assignment.controller";

const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
      managerId,
    } = req.body;

    const newProject = await Project.create({
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
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project", error });
  }
};

const fetchProjects = async (req: Request, res: Response): Promise<void> => {
  const { managerId } = req.query;

  if (!managerId || typeof managerId !== "string") {
    res.status(400).json({ message: "Missing or invalid managerId" });
    return;
  }

  try {
    const projects = await Project.find({ managerId }).sort({ createdAt: -1 });
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.status === "completed") {
      const assignments = await Assignment.find({ projectId: id });

      for (const assignment of assignments) {
        const engineer = await UserModel.findById(assignment.engineerId);

        if (engineer?.availableCapacity !== undefined) {
          engineer.availableCapacity += assignment.allocationPercentage;
          if (engineer.availableCapacity > (engineer.maxCapacity ?? 100)) {
            engineer.availableCapacity = engineer.maxCapacity ?? 100;
          }

          await engineer.save();
        }
      }
    }

    const updated = await Project.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      res.status(404).json({ message: "Project not found" });
      return
    }

    res.status(200).json({ updatedProject: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      res.status(404).json({ message: "Project not found" });
    }
    const deletedAssignment=await Assignment.deleteMany({ projectId: id });
    console.log("deleted assignment: ", deletedAssignment);
    
    res.status(200).json({
      message: "Project and related assignments deleted successfully",
      deletedProject,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

export const getProjectWithAssignments = async (req: Request, res: Response) => {
  try {
    const project = await ProjectModel.findById(req.params.id).lean();
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return
    }

    const assignments = await Assignment.find({ projectId: req.params.id })
      .populate("engineerId", "name email skills")

    res.status(200).json({ project, assignments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project detail" });
  }
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find()
      .populate("engineerId", "name availableCapacity maxCapacity department")
      .populate("projectId", "name startDate endDate");

    const grouped = assignments.reduce((acc, a) => {
      const engineer = a.engineerId as any;
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
        projectName: (a.projectId as any).name,
        projectStart: (a.projectId as any).startDate,
        projectEnd: (a.projectId as any).endDate,
        allocationPercentage: a.allocationPercentage,
        role: a.role,
        startDate: a.startDate,
        endDate: a.endDate,
      });

      return acc;
    }, {} as any);

    res.status(200).json({ data: Object.values(grouped) });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

export const getAssignmentTimeline = async (req: Request, res: Response) => {
  try {
    const timelineData = await Assignment.find()
      .populate("engineerId", "name")
      .populate("projectId", "name")
      .select("startDate endDate role allocationPercentage engineerId projectId");

    const formatted = timelineData.map((a) => ({
      engineer: (a.engineerId as any).name,
      project: (a.projectId as any).name,
      startDate: a.startDate,
      endDate: a.endDate,
      role: a.role,
      allocation: a.allocationPercentage,
    }));

    res.status(200).json({ timeline: formatted });
  } catch (err) {
    console.error("Timeline fetch failed:", err);
    res.status(500).json({ message: "Failed to fetch timeline data" });
  }
};

export const getAssignmentSummary = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find()
      .populate("engineerId", "name email department")
      .populate("projectId", "name status");

    const summary = assignments.map((a) => {
      const engineer = a.engineerId as unknown as IUser;
      const project = a.projectId as unknown as IProject;

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
  } catch (err) {
    console.error("Error generating summary:", err);
    res.status(500).json({ message: "Failed to fetch summary data" });
  }
};

export const getTeamLoad = async (req: Request, res: Response) => {
  try {
    const engineers = await UserModel.find({ role: "engineer" });

    const loadMap = await Promise.all(
      engineers.map(async (eng) => {
        const assignments = await Assignment.find({ engineerId: eng._id });
        const totalAllocated = assignments.reduce(
          (sum, a) => sum + a.allocationPercentage,
          0
        );

        return {
          name: eng.name,
          department: eng.department || "Unassigned",
          maxCapacity: eng.maxCapacity || 100,
          used: totalAllocated,
          available: (eng.maxCapacity || 100) - totalAllocated,
        };
      })
    );

    res.status(200).json({ team: loadMap });
  } catch (err) {
    res.status(500).json({ message: "Team load fetch failed" });
  }
};

// check how many engineer assign on the project
const checkSpaceForProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      res.status(400).json({ message: "projectId is required" });
      return
    }

    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return
    }

    const assignments = await Assignment.find({ projectId });

    const assignedCount = assignments.length;
    const teamSize = project.teamSize;

    const spaceAvailable = assignedCount < teamSize;

    res.status(200).json({
      spaceAvailable,
      message: spaceAvailable
        ? "Space is available for engineer"
        : "No space available for engineer",
    });

  } catch (error) {
    console.error("Error checking project space:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { createProject, fetchProjects, updateProject, deleteProject, checkSpaceForProject };