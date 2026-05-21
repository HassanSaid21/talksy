import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

const __dirname =  path.resolve();
dotenv.config();
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }) );
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);


// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.use( (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

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