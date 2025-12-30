import cloudinary from "../config/cloudinary.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await userModel
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await messageModel.find({
      $or: [
        { senderId: userId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: userId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: receiverId } = req.params;
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      imageUrl = uploadResult.secure_url;
    }

    const newMessage = await messageModel.create({
      senderId: userId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const chatPartnersIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === userId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];
    const chatPartners = await userModel
      .find({ _id: { $in: chatPartnersIds } })
      .select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error fetching chat partners:", error);
    res.status(500).json({ message: "Server error." });
  }
};
