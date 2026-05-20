import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const generateToken = async (user, res) => {
  // Generate a JWT access token for the user
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "20m",
  });
  // Set the token in the response header and send it back to the client
  res.header("Authorization", `Bearer ${token}`).json({ token });
  // Optionally, you can also generate a refresh token and save it in the database for later use
  const refreshToken = crypto.randomBytes(64).toString("hex");
  // Hash the refresh token before saving it to the database for security
  const hashed = await bcrypt.hash(refreshToken, 10);
  // Save the hashed refresh token in the database associated with the user
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    deviceInfo: req.headers["user-agent"], // Store device information for better security and tracking
    ipAddress: req.ip, // Store IP address for additional security measures
  });
  // Set the refresh token in an HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
