import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashToken = async (token) => {
  return bcrypt.hash(token, 10);
};

export const compareToken = async (token, hashedToken) => {
  return bcrypt.compare(token, hashedToken);
};
