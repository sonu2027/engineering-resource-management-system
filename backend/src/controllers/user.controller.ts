import UserModel from "../models/user.model";
import { Request, Response } from "express";

export const getAllEngineers = async (req: Request, res: Response) => {
    try {
        const engineers = await UserModel.find({ role: "engineer" }).select(
            "name email skills department seniority maxCapacity employmentType availableCapacity"
        );

        res.status(200).json({ engineers });
    } catch (err) {
        console.error("Failed to fetch engineers:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getEngineerById = async (req: Request, res: Response) => {
    console.log("hello");

    const { userId } = req.params;

    console.log("id: ", userId);
    try {


        const user = await UserModel.findById(userId).select("-password");
        if (!user || user.role !== "engineer") {
            res.status(404).json({ message: "Engineer not found" });
            return
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching engineer:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateEngineerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        if (!userId) {
            res.status(400).json({ message: "User ID missing in route" });
            return
        }

        const { name, department, skills } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, department, skills },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser || updatedUser.role !== "engineer") {
            res.status(404).json({ message: "Engineer not found" });
            return
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating engineer profile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

