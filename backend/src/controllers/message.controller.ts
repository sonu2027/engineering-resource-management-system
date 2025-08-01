// controllers/messageController.ts
import messageModel from "../models/message.model";
import MessageModel from "../models/message.model";
import UserModel from "../models/user.model";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid or missing userId" });
      return
    }

    const userMessages = await MessageModel.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ updatedAt: -1 });

    const conversationMap = new Map<string, mongoose.Types.ObjectId>();

    userMessages.forEach(msg => {
      const otherUserId = msg.senderId.equals(userId) ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(otherUserId.toString())) {
        conversationMap.set(otherUserId.toString(), otherUserId);
      }
    });

    const uniqueUserIds = Array.from(conversationMap.values());

    const users = await UserModel.find({
      _id: { $in: uniqueUserIds }
    }).select("_id name email");

    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error getting conversations:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesWithUser = async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUserId
  const otherUserId = req.body.otherUserId;

  if (!currentUserId || !otherUserId) {
    res.status(400).json({ error: "Missing user IDs." });
    return
  }

  try {
    const messages = await messageModel.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 }); // Ascending

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
