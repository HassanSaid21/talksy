import {
  validateSignupInput,
  validateLoginInput,
} from "../validators/auth.validator.js";

import {
  createUser,
  authenticateUser,
  createAuthTokens,
  revokeRefreshToken,
  authenticateRefreshToken,
  updateUserProfilePicture,
} from "../services/auth.service.js";
import { sendEmail } from "../services/email.service.js";
import { buildWelcomeEmailTemplate } from "../emails/welcomeTemplate.js";
import { uploadImageToCloudinary } from "../services/cloudinary-onboarding.js";

export const signup = async (req, res) => {
  try {
    const error = validateSignupInput(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const { error: createUserError, user } = await createUser(req.body);

    if (createUserError) {
      return res.status(400).json({ message: createUserError });
    }
    // Generate access and refresh tokens, set the refresh token in an HTTP-only cookie, and return the access token in the response header
    const { accessToken, refreshToken } = await createAuthTokens(
      user._id,
      req,
      res,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    try {
      await sendEmail(
        user.email,
        "Welcome to Talksy",
        buildWelcomeEmailTemplate(user.name, `${appUrl}/welcome`),
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }
    return res
      .status(201)
      .header("Authorization", `Bearer ${accessToken}`)
      .json({
        message: "User registered successfully",
      });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const error = validateLoginInput(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const { error: authenticateUserError, user } = await authenticateUser(
      req.body,
    );

    if (authenticateUserError) {
      return res.status(401).json({ message: authenticateUserError });
    }

    const { accessToken, refreshToken } = await createAuthTokens(
      user._id,
      req,
      res,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .header("Authorization", `Bearer ${accessToken}`)
      .json({
        message: "Login successful",
        user: { _id: user._id, name: user.name, email: user.email },
      });
  } catch (error) {
    console.error("Error  user login:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
export const rotateRefreshToken = async (req, res) => {
  // This endpoint will handle refreshing the access token using the refresh token

  try {
    // Get the refresh token from the request cookies
    const { refreshToken } = req.cookies;
    // If no refresh token is provided, return an error
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    // Validate the refresh token and get the associated user ID
    const { error, tokenDoc } = await authenticateRefreshToken(refreshToken);
    // If the refresh token is invalid, revoked, or expired, return an error
    if (error) {
      return res.status(403).json({ message: error });
    }
    // Generate a new access token and refresh token, save the new refresh token in the database, and return both tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await createAuthTokens(tokenDoc.userId, req, res);

    // Update the refresh token in the database and set the new access token in the response cookies
    await revokeRefreshToken(tokenDoc, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .header("Authorization", `Bearer ${accessToken}`)
      .json({ accessToken });
  } catch (error) {
    console.error("Error rotating refresh token:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const { error, tokenDoc } = await authenticateRefreshToken(refreshToken);
      if (!error && tokenDoc) {
        await revokeRefreshToken(tokenDoc, null);
      }
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profilePictureUrl = req.body.profilePictureUrl; // Assuming the new profile picture URL is sent in the request body
    if (!profilePictureUrl) {
      return res
        .status(400)
        .json({ message: "Profile picture URL is required" });
    }
    //  call a service function to update the user's profile in the database
    const image = await uploadImageToCloudinary(
      profilePictureUrl,
      "/talksy/profile_pictures",
    );

    const updatedUser = await updateUserProfilePicture(
      req.user._id,
      image.secureUrl,
    );

    return res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
