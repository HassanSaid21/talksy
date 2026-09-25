import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const compareToken = (token, hashedToken) =>
  crypto.timingSafeEqual(
    Buffer.from(hashToken(token), "hex"),
    Buffer.from(hashedToken, "hex"),
  );
