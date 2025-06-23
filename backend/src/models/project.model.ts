import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    requiredSkills: string[];
    teamSize: number;
    status: "planning" | "active" | "completed";
    managerId: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        requiredSkills: [{ type: String, required: true }],
        teamSize: { type: Number, required: true },
        status: {
            type: String,
            enum: ["planning", "active", "completed"],
            default: "planning"
        },
        managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
