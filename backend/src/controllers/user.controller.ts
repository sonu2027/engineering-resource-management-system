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
