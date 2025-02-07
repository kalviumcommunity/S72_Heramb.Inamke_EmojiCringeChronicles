import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const mongoURI = process.env.MONGO_URI;

// Ensure MongoDB URI is provided
if (!mongoURI) {
  console.error("❌ Missing MONGO_URI in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Home route - Displays MongoDB connection status
app.get("/", (req, res) => {
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.json({ database: statusMap[mongoose.connection.readyState] || "Unknown" });
});

// Basic /ping route with error handling
app.get("/ping", (req, res, next) => {
  try {
    res.send("Pong");
  } catch (error) {
    next(error);
  }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
  });
});

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `The resource at ${req.originalUrl} was not found on this server.`,
  });
});

// Handle graceful shutdown and close MongoDB connection
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("⚠️ MongoDB connection closed.");
  process.exit(0);
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
