import express from "express";
import {
  login,
  rotateRefreshToken,
  signup,
  logout ,
  updateProfile
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

// @route   GET api/auth/login
// @desc    Authenticate user and get token
// @access  Public

router.post("/login", login);

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/signup", signup);

// @route   POST api/auth/refresh-token
router.post("/refresh-token", rotateRefreshToken);

// @route   POST api/auth/logout

router.put('/update-profile',  protect, updateProfile);





export default router;
