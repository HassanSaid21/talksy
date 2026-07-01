import Conversation from "../models/Conversation.js";

export const getOrCreateConversation = async (senderId, receiverId) => {
  try {
    const conversationKey = [senderId, receiverId].map(String).sort().join(":");

    const conversation = await Conversation.findOneAndUpdate(
      {
        conversationKey,
      },
      {
        // If the conversation doesn't exist, create a new one

        $setOnInsert: {
          participants: [senderId, receiverId],
          conversationKey,
        },
      },
      {
        upsert: true,
        returnDocument: 'after' 
      },
    );
    return conversation;
  } catch (error) {
    throw error;
  }
};



export const getUserConversations = async (userId) => {
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "name profilePicture")
.sort({
    lastMessageAt: -1
});
 
//
const formatted = conversations.map((conversation) => {
    const otherUser = conversation.participants.find(
        (user) => user._id.toString() !== userId.toString()
    );

    return {
        user: otherUser,
        lastMessage: conversation.lastMessageText,
        lastMessageSender: conversation.lastMessageSender,
        lastMessageAt: conversation.lastMessageAt,
    };
});
return formatted;
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    throw error;
  }
};
