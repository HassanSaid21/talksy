import express from "express";
import {
  login,
  rotateToken,
  signup,
  logout ,
  updateProfile
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

// @route   GET api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.get("/login", (req, res, next)=>{
  res.status(200).json({ message: "Login endpoint is working" });
});
router.post("/login", login);

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/signup", signup);

// @route   POST api/auth/refresh
router.post("/refresh", rotateToken);

// @route   POST api/auth/logout
router.post("/logout", logout);

router.put('/update-profile',  protect, updateProfile);





export default router;
