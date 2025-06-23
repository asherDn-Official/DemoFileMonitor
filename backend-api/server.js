const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Express Setup
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Setup
const MONGODB_URI =
  "mongodb+srv://bhuvan:Semicon25@cluster0.pbfgnc7.mongodb.net/EsdMonitor?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  maxPoolSize: 5,
  retryWrites: true,
  retryReads: true,
  connectTimeoutMS: 30000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
};

mongoose.set("debug", true); // optional for debugging
mongoose.set("strictQuery", false); // to match existing code

// Define Schema & Model locally for this project
const deviceLogSchema = new mongoose.Schema({
  DeviceID: Number,
  Connected: String,
  Date: String,
  Time: String,
  Operator1: String,
  Operator2: String,
  Mat1: String,
  Mat2: String,
});
const DeviceLog = mongoose.model("DeviceLog", deviceLogSchema);

// Mongo Connection
mongoose
  .connect(MONGODB_URI, MONGO_OPTIONS)
  .then(() => {
    console.log("✅ MongoDB connected via Express backend");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// API Route - now uses DeviceLog model
app.get("/api/data", async (req, res) => {
  try {
    const logs = await DeviceLog.find().sort({ Date: -1, Time: -1 }); // newest first
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    console.error("❌ Query failed:", err.message);
    res.status(500).json({ success: false, message: "DB query failed" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
