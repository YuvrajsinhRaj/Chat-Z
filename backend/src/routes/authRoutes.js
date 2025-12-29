import express from "express";

const router = express.Router();

import { signup } from "../controller/authontroller.js";

router.post("/signup", signup);

router.get("/logout", (req, res) => {
  res.send("Logout Route");
});

export default router;
