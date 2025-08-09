import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: false,
        },
        fileUrl: {
            type: String, // store binary image
            required: false,
        },
        filePublicId: {
            type: String,
        },
        fileType: { type: String }, // image/jpeg, video/mp4, etc.
        fileName: { type: String },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);