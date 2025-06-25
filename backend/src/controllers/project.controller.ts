import Project from "../models/project.model";
import { Request, Response } from "express";
import Assignment from "../models/assignment.model";
import UserModel from "../models/user.model";

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

// const updateProject = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const updates = req.body;

//   console.log(updates);

//   if(updates.status==='completed'){
//     to bhai yaha sare engineer jo es project me allocate the unsabko uska capacity return karna jo ki es project me uska capacity allocate hua tha
//   }


//   try {
//     const updated = await Project.findByIdAndUpdate(id, updates, { new: true });
//     if (!updated) {
//       res.status(404).json({ message: "Project not found" });
//     }
//     res.status(200).json({ updatedProject: updated });
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ message: "Failed to update project" });
//   }
// };
const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // If status is getting marked as completed
    if (updates.status === "completed") {
      // Step 1: Get all assignments for this project
      const assignments = await Assignment.find({ projectId: id });

      for (const assignment of assignments) {
        const engineer = await UserModel.findById(assignment.engineerId);

        if (engineer?.availableCapacity !== undefined) {
          engineer.availableCapacity += assignment.allocationPercentage;
          // Optional: Cap it at maxCapacity
          if (engineer.availableCapacity > (engineer.maxCapacity ?? 100)) {
            engineer.availableCapacity = engineer.maxCapacity ?? 100;
          }

          await engineer.save();
        }
      }
    }

    // Step 2: Update the project
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
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully", deleted });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

export { createProject, fetchProjects, updateProject, deleteProject };