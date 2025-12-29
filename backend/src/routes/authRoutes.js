import express from "express";

const router = express.Router();

import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controller/authontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;
