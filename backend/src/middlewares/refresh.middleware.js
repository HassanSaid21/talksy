import { RefreshToken } from "../models/refreshToken.js";

export const refreshTokenMiddleware = async (req, res, next) => {
  try {
    // Extract the refresh token from the request cookies
    const token = res.cookies.refreshToken;
    // If no token is found, return an error
    if (!token) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }

    const stroredToken = await RefreshToken.findOne({ token });
    // If the token is not found in the database, return an error
    if (!stroredToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }
    // Check if the token has expired
    if (stroredToken.expiresAt < new Date()) {
      res.status(401).json({ message: "Refresh token expired" });
      return;
    }
    // Check if the token has been revoked
    if (stroredToken.revoked) {
      res.status(401).json({ message: "detect reused attack" });
      return;
    }
    // invalidate the current refresh token by marking it as revoked in the database
    stroredToken.revoked = true;
    await stroredToken.save();
    //create a new refresh token and save it in the database
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const hashedToken = await bcrypt.hash(newRefreshToken, 10);
    // Save the new hashed refresh token in the database associated with the user
    await RefreshToken.create({
      token: hashedToken,
      userId: stroredToken.userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      deviceInfo: req.headers["user-agent"], // Store device information for better security and tracking
      ipAddress: req.ip, // Store IP address for additional security measures
    });
    // Set the new refresh token in an HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    // Optionally, you can also generate a new access token and set it in the response header
    const accessToken = jwt.sign(
      { id: stroredToken.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "20m",
      },
    );
    res.header("Authorization", `Bearer ${accessToken}`);
    next();
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
