import express from "express";

const router = express.Router();

import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controller/authontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import arcjetMiddleware from "../middleware/arcjetMiddleware.js";

// Apply Arcjet middleware to all auth routes
// router.use(arcjetMiddleware);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", authMiddleware, updateProfile);
router.get("/check", authMiddleware, (req, res) =>
  res.status(200).json(req.user)
);

export default router;
