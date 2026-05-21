
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { hashToken } from "../utils/hash.js";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import RefreshToken from "../models/RefreshToken.js";


export const createUser = async ({ name, email, password }) => {

  const existingUser = await User.findOne({ email }).lean();
  const res = { error: null, user: null };
  if (existingUser) {
    res.error = "Email already in use";
    return res;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  res.user = user;
  return res;
};


export const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).lean();
  const res = { error: null, user: null };
  if (!user) {
    res.error = "Invalid email or password";
    return res;
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    res.error = "Invalid email or password";
    return res;
  }

  res.user = user;

  return res;
};

// Generate a new access token using a valid refresh token
export const authenticateRefreshToken = async (rawToken) => {
  const hashedToken = await hashToken(rawToken);
  const tokenDoc = await RefreshToken.findOne({ token: hashedToken }).lean();
  const res = { error: null, tokenDoc: null };
  if (!tokenDoc) {
    res.error = "Invalid refresh token";
    return res;
  }
  if (tokenDoc.revoked) {
    res.error = "Refresh token has been revoked";
    return res;
  }
  if (new Date() > tokenDoc.expiresAt) {
    res.error = "Refresh token has expired";
    return res;
  }
  res.tokenDoc = tokenDoc;
  return res;
};

export const createAuthTokens = async (userId, req, res) => {
  // Generate a new access token and refresh token, save the refresh token in the database, and return both tokens
  const accessToken = generateAccessToken(userId);

  const rawRefreshToken = generateRefreshToken();

  const hashedRefreshToken = await hashToken(rawRefreshToken);

  await RefreshToken.create({
    token: hashedRefreshToken,
    userId,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    deviceInfo: req.headers["user-agent"],
    ipAddress: req.ip,
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
  };
};

export const revokeRefreshToken = async (token, newToken) => {
  token.revoked = true;
  token.replacedByToken = newToken ? await hashToken(newToken) : null;
};
