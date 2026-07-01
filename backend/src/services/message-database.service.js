
import Message from "../models/Message.js";
import { getOrCreateConversation } from "./conversation.servise.js";
import Conversation from "../models/Conversation.js";

// export const getUserChats = async (userId) => {
//   try {
//   const conversations = await getOrCreateConversation(userId);

    
//   } catch (error) {
//     console.error("Error fetching user chats:", error);
//     throw error;
//   }
// };

export const getMessagesBetweenUsers = async (userId, contactId) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    })
      .sort({ createdAt:-1 }) // Sort messages by timestamp in ascending order
      .limit(50); // Limit to the latest 50 messages for performance
    return messages;
  } catch (error) {
    console.error("Error fetching messages between users:", error);
    throw error;
  }
};

export const saveMessage = async (senderId, receiverId, text  , imageUrl ) => {
  try {
    const conversation =  await getOrCreateConversation(senderId, receiverId);
    
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      imageUrl,
      conversationId: conversation._id,
    });

    await Conversation.findByIdAndUpdate(
    conversation._id,
    {
        lastMessage: message._id,
        lastMessageText: message.text? message.text : message.imageUrl ? "Image" : "File",
        lastMessageSender: senderId,
        lastMessageAt: message.createdAt
    }
);
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};



// export const getContacts = async (userId) => {
// }