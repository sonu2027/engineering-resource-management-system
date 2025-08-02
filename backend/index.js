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
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("./src/connectDB"));
const app_1 = __importDefault(require("./src/app"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const message_model_1 = __importDefault(require("./src/models/message.model"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: "./.env" });
const port = process.env.PORT || 7000;
// ✅ HTTP server create (Express app ke sath)
const httpServer = (0, http_1.createServer)(app_1.default);
// ✅ Socket.IO server attach
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
});
exports.io = io;
const onlineUsers = {};
// ✅ Socket.IO events
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    // 📌 JOIN logic here
    socket.on("join", (userId) => {
        socket.data.userId = userId; // store userId in socket's memory
        onlineUsers[userId] = socket.id; // map userId to socket.id
        console.log(`🟢 ${userId} is online with socket ID: ${socket.id}`);
        // Optionally notify other users:
        socket.broadcast.emit("user-online", userId);
    });
    // 📩 Message receive
    socket.on("send-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("📬 Received message:", data);
        try {
            // ✅ Save to MongoDB
            const savedMessage = yield message_model_1.default.create({
                senderId: new mongoose_1.default.Types.ObjectId(data.senderId),
                receiverId: new mongoose_1.default.Types.ObjectId(data.receiverId),
                content: data.content,
                timestamp: new Date(data.timestamp),
            });
            // ✅ Emit to receiver
            const receiverSocketId = onlineUsers[data.receiverId];
            const senderSocketId = onlineUsers[data.senderId];
            console.log("receiverSocketId", receiverSocketId, "and senderSocketId", senderSocketId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", savedMessage); // Send the saved message
            }
            if (senderSocketId) {
                io.to(senderSocketId).emit("receive-message", savedMessage); // ✅ This line updates sender UI
            }
        }
        catch (err) {
            console.error("❌ Message save failed:", err);
        }
    }));
    // ❌ Disconnect handler
    socket.on("disconnect", () => {
        try {
            const userId = socket.data.userId;
            if (userId && onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                console.log(`🔴 ${userId} went offline`);
                socket.broadcast.emit("user-offline", userId);
            }
        }
        catch (err) {
            console.error("❌ Disconnect cleanup failed:", err);
        }
    });
});
(0, connectDB_1.default)()
    .then(() => {
    app_1.default.get("/", (req, res) => {
        res.send(`<h1>Server running at http://localhost:${port}</h1>`);
    });
    httpServer.listen(port, () => {
        console.log(`⚙️ Server running at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
});
