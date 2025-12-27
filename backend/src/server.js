import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoute from "./routes/authRoutes.js";
import messageRoute from "./routes/messageRoute.js";

const app = express();
const __dirname = path.resolve();
dotenv.config();

const PORT = process.env.PORT || 5174;

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

//make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
