import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import { connectDB } from "./src/config/db.js";
import authRoute from "./src/routes/authRoutes.js";
import messageRoute from "./src/routes/messageRoute.js";

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 5174;

app.use(express.json({ limit: "5mb" })); //req.body
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

//make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
