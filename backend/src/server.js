import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
