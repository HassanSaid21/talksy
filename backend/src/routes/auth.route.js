import express from "express";
import {
  login,
  rotateRefreshToken,
  signup,
  logout ,
} from "../controllers/auth.controller.js";
const router = express.Router();

// @route   GET api/auth/login
// @desc    Authenticate user and get token
// @access  Public

router.post("/login", login);

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/signup", signup);

router.post("/refresh-token", rotateRefreshToken);

router.post("/logout", logout);

export default router;
