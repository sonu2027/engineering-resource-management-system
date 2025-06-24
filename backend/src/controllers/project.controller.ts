import Project from "../models/project.model";
import { Request, Response } from "express";

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


export { createProject, fetchProjects };