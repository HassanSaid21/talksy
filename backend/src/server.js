import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";
import messagesRoute from "./routes/messages.route.js";
import cors from "cors";
const __dirname =  path.resolve();
dotenv.config();
const app = express();


// Middleware
app.use(express.json());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(express.urlencoded({ extended: true }) );
app.use(cookieParser());
app.use(arcjetMiddleware); // Apply Arcjet middleware globally to all routes. Adjust as needed for specific routes.
// Routes

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoute);


// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.use( (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
 const  PORT = process.env.PORT || 5000;
 const startServer = async () => {
   try {
     await connectDB();
     app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}` );
     });
   } catch (error) {
     console.error("Failed to start server:", error);
     process.exit(1);
   }
 };
 startServer();