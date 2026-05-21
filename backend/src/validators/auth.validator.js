
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateSignupInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return "All fields are required";
  }

  if (!validateEmail(email)) {
    return "Invalid email format";
  }

  if (!validatePassword(password)) {
    return "Password must be at least 6 characters";
  }

  return null;
};

export const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "All fields are required";
  }

  if (!validateEmail(email)) {
    return "Invalid email format";
  }

  return null;
};