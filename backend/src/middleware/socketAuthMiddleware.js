import jwt from "jsonwebtoken";
import cookie from "cookie";
import userModel from "../models/userModel.js";
import { ENV } from "../config/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    let token;

    /* ===== 1. READ COOKIE MANUALLY ===== */
    if (socket.request.headers.cookie) {
      const cookies = cookie.parse(socket.request.headers.cookie);
      token = cookies.token;
    }

    /* ===== 2. FALLBACK TO AUTH HEADER ===== */
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      console.log("❌ Socket auth failed: No token");
      return next(new Error("Unauthorized"));
    }

    /* ===== 3. VERIFY TOKEN ===== */
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    /* ===== 4. FETCH USER ===== */
    const user = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!user) {
      console.log("❌ Socket auth failed: User not found");
      return next(new Error("Unauthorized"));
    }

    /* ===== 5. ATTACH USER ===== */
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `✅ Socket authenticated: ${user.fullname} (${user._id})`
    );

    next();
  } catch (error) {
    console.log("❌ Socket auth error:", error.message);
    next(new Error("Unauthorized"));
  }
};
