import Message from "../models/message.js";
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
    
    if (chats.length === 0) {
      res.status(404).json({ error: "No chats found" });
    }
    res.status(200).json({ chats });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
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
        const {  text  , image } = req.body; // Assuming the receiver ID and message content are sent in the request body
        const receiverId = req.params.id;
        if ( !text && !image) {
            return res.status(400).json({ error: " Message content required" });
        }
        if(!receiverId){

          return res.status(400).json({ error: "Receiver ID is required" });
        }
        // lets  uplaod the message content to cloudinary and get the url and save the url in the database instead of the content if the content is an image or a file
         
        let imageUrl = null;
        if(image){

            imageUrl  = uploadImageToCloudinary(image);
          }
         
        await saveMessage(senderId, receiverId, text , imageUrl);

        //TODO:  add socket.io functionality to send the message to the receiver in real-time
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// export const getContacts =  async (req, res) => {
//     try {
//         const userId = req.user._id; // Assuming the user ID is available in req.user after authentication
//         if (!userId) {
//             return res.status(400).json({ error: "User ID is required" });
//         }
//         const contacts = await getUserContacts(userId);
//         if (contacts.length === 0) {
//             res.status(404).json({ error: "No contacts found" });
//         }
//         res.status(200).json({ contacts });
//     } catch (error) {
//         console.error("Error fetching contacts:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
