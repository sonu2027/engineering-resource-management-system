import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
    engineerId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    allocationPercentage: number;
    startDate: Date;
    endDate: Date;
    role: string;
}

const AssignmentSchema = new Schema<IAssignment>(
    {
        engineerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        allocationPercentage: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        role: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IAssignment>("Assignment", AssignmentSchema);
