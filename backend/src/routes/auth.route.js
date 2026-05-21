import express from "express";
import {
  login,
  rotateRefreshToken,
  signup,
} from "../controllers/auth.controller";
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

export default router;
