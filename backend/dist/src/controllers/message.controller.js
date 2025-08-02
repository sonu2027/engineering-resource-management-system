"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesWithUser = exports.getUserConversations = void 0;
// controllers/messageController.ts
const message_model_1 = __importDefault(require("../models/message.model"));
const message_model_2 = __importDefault(require("../models/message.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getUserConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid or missing userId" });
            return;
        }
        const userMessages = yield message_model_2.default.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ updatedAt: -1 });
        const conversationMap = new Map();
        userMessages.forEach(msg => {
            const otherUserId = msg.senderId.equals(userId) ? msg.receiverId : msg.senderId;
            if (!conversationMap.has(otherUserId.toString())) {
                conversationMap.set(otherUserId.toString(), otherUserId);
            }
        });
        const uniqueUserIds = Array.from(conversationMap.values());
        const users = yield user_model_1.default.find({
            _id: { $in: uniqueUserIds }
        }).select("_id name email");
        res.status(200).json(users);
    }
    catch (err) {
        console.error("❌ Error getting conversations:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserConversations = getUserConversations;
const getMessagesWithUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.body.currentUserId;
    const otherUserId = req.body.otherUserId;
    if (!currentUserId || !otherUserId) {
        res.status(400).json({ error: "Missing user IDs." });
        return;
    }
    try {
        const messages = yield message_model_1.default.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId }
            ]
        }).sort({ timestamp: 1 }); // Ascending
        res.json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getMessagesWithUser = getMessagesWithUser;
