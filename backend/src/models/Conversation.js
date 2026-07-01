import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // Array of participants in the conversation. This will typically contain two user IDs for a one-on-one chat.
    // For group chats, this can contain more than two user IDs.
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // These should not create two conversations. We need one identifier.
    // This can be a combination of the two user IDs, sorted and concatenated.
    // For example, if user A has ID 1 and user B has ID 2, the conversationKey could be "1_2" or "2_1" (sorted).
    // This way, we can ensure that there's only one conversation between any two users.
    conversationKey: {
      type: String,
      unique: true,
      required: true,
    },

    // The last message in the conversation. This can be used to quickly display the most recent message in a chat list.
    // The last message can be populated with the actual message document when fetching conversations.
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // The text of the last message. This is useful for quickly displaying a preview of the last message in a chat list without needing to populate the entire message document.
    lastMessageText: String,

    // The sender of the last message. This can be used to display who sent the last message in a chat list.
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastMessageAt: Date,
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
