import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware.js";

/* ===== CONSTANTS ===== */
const CLIENTS = [
  "https://chat-z-lwfn.onrender.com",
  "http://localhost:5173",
];

/* ===== APP ===== */
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

app.use(
  cors({
    origin: CLIENTS,
    credentials: true,
  })
);

/* ===== SERVER ===== */
const server = http.createServer(app);

/* ===== SOCKET ===== */
const io = new Server(server, {
  cors: {
    origin: CLIENTS,
    credentials: true,
  },
});

/* ===== ONLINE USERS MAP ===== */
const userSocketMap = {}; // { userId: socketId }

/* ===== EXPORT HELPER ===== */
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

/* ===== AUTH MIDDLEWARE ===== */
io.use(socketAuthMiddleware);

/* ===== CONNECTION ===== */
io.on("connection", (socket) => {
  const userId = socket.user._id.toString();

  console.log("✅ User connected:", socket.user.fullname);

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.user.fullname);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

/* ===== EXPORTS ===== */
export { io, app, server };
