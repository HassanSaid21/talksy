import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },

    revoked: {
      type: Boolean,
      default: false,
    },
    replacedByToken: String, // Optional: Store the new token that replaces this one when it's refreshed
    deviceInfo: String, // Optional: Store device information for better security and tracking
    ipAddress: String, // Optional: Store IP address for additional security measures
  },
  { timestamps: true },
);

 const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;