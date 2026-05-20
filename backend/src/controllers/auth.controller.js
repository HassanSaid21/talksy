import { generateToken } from "../lib/utils.js";
import { RefreshToken } from "../models/refreshToken.js";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  // Extract user data from the request body
  const { username, email, password } = req.body;
  // Here you would typically add logic to save the user to the database
  try {
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" }); // Bad Request
    }
    // Additional validation (e.g., password strength, email format) can be added here
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // Email format validation
    if (RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email) === false) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Check if user already exists
    const user = await User.findOne({ email });
    // If user exists, return an error
    if (user) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // Hash the password before saving to the database
    const cryptedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance and save it to the database
    const newUser = new User({
      username,
      email,
      password: cryptedPassword,
    });
    // Check if the user was created successfully
    if (!newUser) {
      return res.status(500).json({ message: "Error creating user" });
    }
    // generate a token for the user and set it in the response header and cookie
    generateToken(newUser, res);
    // Save the user to the database
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
  // For demonstration, we'll just return the received data
  res.status(201).json({ message: "User registered successfully" });
};


export const login = (req , res , next )=>{
    
    try{
        // Extract email and password from the request body
        const { email , password } = req.body;
        // Basic validation
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        // Additional validation (e.g., password strength, email format)
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if(RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email) === false){
            return res.status(400).json({ message: "Invalid email format" });
        }
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        } 
        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // If authentication is successful, generate a token for the user and set it in the response header and cookie 
        generateToken(user , res);
        res.status(200).json({ message: "Login successful" });
    }catch(error){
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const refreshToken = async (req, res, next) => {
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
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    // Check if the token has expired
    if (stroredToken.expiresAt < new Date()) {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    // Check if the token has been revoked detect reused attack
    if (stroredToken.revoked) {
      return res.status(403).json({ message: "detect reused attack" });
    }
    //create a new refresh token and save it in the database
    await generateToken(newUser, res);
    // invalidate the current refresh token by marking it as revoked in the database
    stroredToken.revoked = true;
    stroredToken.replacedByToken = hashedToken; // Optionally store the new token that replaces this one for better tracking
    await stroredToken.save();
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
