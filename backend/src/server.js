import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import path from "path";

const __dirname =  path.resolve();
dotenv.config();
const app = express();


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);


// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.use( (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}` );
});
