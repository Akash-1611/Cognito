import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import codeRoutes from "./routes/code.js";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import executeRoutes from "./routes/execute.js";
import collaborationRoutes from "./routes/collaboration.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roomRoutes from "./routes/roomRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.use((req, res, next) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.url}`);
  console.log("📦 Request Body:", req.body);
  next();
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/files", authMiddleware, fileRoutes);
app.use("/execute", authMiddleware, executeRoutes);
app.use("/collab", collaborationRoutes);
app.use("/code", codeRoutes);
app.use("/api", roomRoutes);
app.get("/", (req, res) => res.send("IDE Backend Running"));

// ✅ WebSocket Server for Real-Time Collaboration
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

import Room from "./models/Room.js"; // Import Room model

io.on("connection", (socket) => {
  console.log("🔗 A user connected:", socket.id);

  socket.on("joinRoom", async (roomId) => {
    if (!roomId) {
      console.warn(`⚠️ User ${socket.id} tried to join a room without a valid ID.`);
      return;
    }
  
    const room = await Room.findOne({ roomId });
    if (!room) {
      console.warn(`⚠️ Room ${roomId} does not exist.`);
      socket.emit("error", "Room does not exist!");
      return;
    }
  
    socket.join(roomId);
    console.log(`👥 User ${socket.id} joined room: ${roomId}`);

    // ✅ Send the latest code when a user reconnects
    socket.emit("codeUpdate", room.code);
  });

  socket.on("updateCode", async ({ roomId, code }) => {
    await Room.updateOne(
      { roomId },
      { $set: { code, updatedAt: new Date() } },
      { upsert: true }
    );
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("updateOutput", ({ roomId, output }) => {
    socket.to(roomId).emit("outputUpdate", output);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

  


httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));