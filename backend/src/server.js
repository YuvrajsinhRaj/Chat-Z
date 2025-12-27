import express from "express";
import dotenv from "dotenv";

import authRoute from "./routes/authRoutes.js";
import messageRoute from "./routes/messageRoute.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5174;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
