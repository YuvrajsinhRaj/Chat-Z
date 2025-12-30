import Router from "express";
import arcjetMiddleware from "../middleware/arcjetMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatPartners,
} from "../controller/messageController.js";

const router = Router();

// this middleware runs in all routes defined below and in order they are defined
router.use(arcjetMiddleware, authMiddleware);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);

router.post("/send/:id", sendMessage);

export default router;
