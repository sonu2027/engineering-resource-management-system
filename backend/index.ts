import dotenv from "dotenv";
import connectDB from "./src/connectDB";
import app from "./src/app";
import { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import MessageModel from './src/models/message.model';
import mongoose from 'mongoose';

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 7000;

// ✅ HTTP server create (Express app ke sath)
const httpServer = createServer(app);

// ✅ Socket.IO server attach
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

const onlineUsers: Record<string, string> = {};

// ✅ Socket.IO events
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // 📌 JOIN logic here
  socket.on("join", (userId: string) => {
    socket.data.userId = userId; // store userId in socket's memory
    onlineUsers[userId] = socket.id; // map userId to socket.id

    console.log("onlineUsers: ", onlineUsers);


    console.log(`🟢 ${userId} is online with socket ID: ${socket.id}`);

    // Optionally notify other users:
    socket.broadcast.emit("user-online", userId);
  });

  // 📩 Message receive
  socket.on("send-message", async (data) => {
    console.log("📬 Received message:", data);

    try {
      // ✅ Save to MongoDB
      const savedMessage = await MessageModel.create({
        senderId: new mongoose.Types.ObjectId(data.senderId as string),
        receiverId: new mongoose.Types.ObjectId(data.receiverId as string),
        content: data.content,
        timestamp: new Date(data.timestamp),
      });

      // ✅ Emit to receiver
      const receiverSocketId = onlineUsers[data.receiverId];
      const senderSocketId = onlineUsers[data.senderId];

      console.log("receiverSocketId", receiverSocketId, "and senderSocketId", senderSocketId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("receive-message", savedMessage); // ✅ This line updates sender UI
      }

      if (receiverSocketId!=senderSocketId) {
        io.to(receiverSocketId).emit("receive-message", savedMessage); // Send the saved message
      }

    } catch (err) {
      console.error("❌ Message save failed:", err);
    }
  });


  // ❌ Disconnect handler
  socket.on("disconnect", () => {
    try {
      const userId = socket.data.userId;
      if (userId && onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log(`🔴 ${userId} went offline`);
        socket.broadcast.emit("user-offline", userId);
      }
    } catch (err) {
      console.error("❌ Disconnect cleanup failed:", err);
    }
  });
});


connectDB()
  .then(() => {
    app.get("/", (req: Request, res: Response) => {
      res.send(`<h1>Server running at http://localhost:${port}</h1>`);
    });

    httpServer.listen(port, () => {
      console.log(`⚙️ Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });

export { io };
