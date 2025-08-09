import dotenv from "dotenv";
import connectDB from "./src/connectDB";
import app from "./src/app";
import { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import MessageModel from './src/models/message.model';
import mongoose from 'mongoose';
import { uploadOnCloudinary } from "./src/utils/cloudinary";

interface UploadResult {
  url: string;
  public_id: string;
}

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
  maxHttpBufferSize: 20e6, // Allowing payloads (Images size) up to 20MB
});

const onlineUsers: Record<string, string> = {};

// ✅ Socket.IO events
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // JOINING logic here
  socket.on("join", (userId: string) => {
    socket.data.userId = userId; // storing userId in socket's memory
    onlineUsers[userId] = socket.id; // maping userId to socket.id

    console.log("onlineUsers: ", onlineUsers);


    console.log(`🟢 ${userId} is online with socket ID: ${socket.id}`);

    // Optionally I will notify other users in future:
    socket.broadcast.emit("user-online", userId);
  });

  // Message receive
  socket.on("send-message", async (data) => {
    console.log("📬 Received message:", data);

    try {
      if (!data.senderId || !mongoose.Types.ObjectId.isValid(data.senderId)) {
        throw new Error(`Invalid senderId: ${data.senderId}`);
      }
      if (!data.receiverId || !mongoose.Types.ObjectId.isValid(data.receiverId)) {
        throw new Error(`Invalid receiverId: ${data.receiverId}`);
      }

      const messageData: any = {
        senderId: new mongoose.Types.ObjectId(data.senderId),
        receiverId: new mongoose.Types.ObjectId(data.receiverId),
        timestamp: new Date(data.timestamp),
      };

      if (data.content) {
        messageData.content = data.content;
      }

      if (data.fileUrl) {
        const imageBuffer = Buffer.from(
          data.fileUrl.replace(/^data:.+;base64,/, ""),
          "base64"
        );
        const response = await uploadOnCloudinary(
          imageBuffer,
          `${Date.now()}_${data.fileName}`
        );

        messageData.fileUrl = response.url;
        messageData.filePublicId = response.public_id;
        messageData.fileType = data.fileType || null;
        messageData.fileName = data.fileName || null;
      }

      const savedMessage = await MessageModel.create(messageData);
      console.log("savedMessage: ", savedMessage);


      const receiverSocketId = onlineUsers[data.receiverId];
      const senderSocketId = onlineUsers[data.senderId];

      if (senderSocketId) {
        io.to(senderSocketId).emit("receive-message", savedMessage);
      }
      if (receiverSocketId && receiverSocketId !== senderSocketId) {
        io.to(receiverSocketId).emit("receive-message", savedMessage);
      }

    } catch (err) {
      console.error("❌ Message save failed:", err);
    }
  });




  // Disconnect handler
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
