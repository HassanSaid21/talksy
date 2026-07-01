

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {  getChats, getMessages, sendMessage } from "../controllers/message.controllers.js";
const router = express.Router();


// router.get("/contacts", protect ,getContacts);    
router.get('/chats',  protect, getChats);
router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, sendMessage);
  


export default router;  
