import mongoose, { Document, Schema } from "mongoose";

// 1. TypeScript Interface
export interface IUser extends Document {
    email: string;
    name: string;
    role: "engineer" | "manager";
    employmentType?: "full-time" | "part-time";
    skills?: string[];
    seniority?: "junior" | "mid" | "senior";
    maxCapacity?: number;
    department?: string;
}

// 2. Mongoose Schema
const UserSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ["engineer", "manager"],
            required: true
        },

        // Only for engineers
        employmentType: {
            type: String,
            enum: ["full-time", "part-time"],
            required: function () {
                return this.role === "engineer";
            }
        },
        maxCapacity: {
            type: Number
            // Will be auto-filled in pre-save
        },
        skills: {
            type: [String],
            default: []
        },
        seniority: {
            type: String,
            enum: ["junior", "mid", "senior"]
        },
        department: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// 4. Export model
const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
