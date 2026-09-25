import mongoose from "mongoose";
import User from "../models/User.js";
import { uploadImageToCloudinary } from "../services/cloudinary-onboarding.js";
import { getUserConversations } from "../services/conversation.servise.js";
import {  saveMessage , getMessagesBetweenUsers } from "../services/message-database.service.js";

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the user ID is available in req.user after authentication
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    //✔ optimize this query to get only the latest message for each contact and sort by latest message timestamp
    //✔  try converstion collection to store the latest message for each contact and use that collection to get the contacts list and latest message for each contact
    const chats  = await getUserConversations(userId);
    
   return res.status(200).json({ chats });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("name profilePicture")
      .sort({ name: 1 })
      .limit(100)
      .lean();

    const contacts = users.map((contact) => ({
      _id: contact._id,
      owner: req.user._id,
      contact,
    }));
    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get messages between two users
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the user ID is available in req.user after authentication
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const contactId = req.params.id; // Assuming the contact ID is sent as a URL parameter
    if (!contactId) {
      return res.status(400).json({ error: "Invalid contact ID" });

    }
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    const messages = await getMessagesBetweenUsers(userId, contactId);
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
     res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  //TODO:  DON'T FORGET TO ADD FILE UPLOAD FUNCTIONALITY FOR FILE MESSAGES LIKE PDFS,DOCS,ETC.
    try {
        const senderId = req.user._id; // Assuming the sender ID is available in req.user after authentication
        if (!senderId) {
            return res.status(400).json({ error: "Sender ID is required" });
        }
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const trimmedText = typeof text === "string" ? text.trim() : "";
        if (!trimmedText && !image) {
            return res.status(400).json({ error: " Message content required" });
        }
        if (trimmedText.length > 1000) {
          return res.status(400).json({ error: "Message must be 1000 characters or fewer" });
        }
        if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
          return res.status(400).json({ error: "Receiver ID is required" });
        }
        if (senderId.toString() === receiverId) {
          return res.status(400).json({ error: "You cannot message yourself" });
        }
        const receiver = await User.exists({ _id: receiverId });
        if (!receiver) {
          return res.status(404).json({ error: "Receiver not found" });
        }
        // lets  uplaod the message content to cloudinary and get the url and save the url in the database instead of the content if the content is an image or a file
         
        let imageUrl = null;
        if (image) {
          if (
            typeof image !== "string" ||
            !/^data:image\/(png|jpe?g|webp|gif);base64,/.test(image) ||
            Buffer.byteLength(image, "utf8") > 4 * 1024 * 1024
          ) {
            return res.status(400).json({ error: "Image must be a supported image under 3 MB" });
          }
          const uploadedImage = await uploadImageToCloudinary(image, "talksy-messages");
          imageUrl = uploadedImage.secureUrl;
        }
         
        const message = await saveMessage(senderId, receiverId, trimmedText, imageUrl);

        //TODO:  add socket.io functionality to send the message to the receiver in real-time
        return res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
