const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const DataModel = require("../shared/models/DataModel");

// Express Setup
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Setup
const MONGODB_URI =
  "mongodb+srv://asherdntrk:3k4oeR1naWvBLmzQ@cluster0.byggpdg.mongodb.net/FileMonitor?retryWrites=true&w=majority";
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

// Mongo Connection
mongoose
  .connect(MONGODB_URI, MONGO_OPTIONS)
  .then(() => {
    console.log("✅ MongoDB connected via Express backend");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// API Route
app.get("/api/data", async (req, res) => {
  try {
    const rawData = await mongoose.connection.db
      .collection("excel_files")
      .find({})
      .sort({ lastUpdated: -1 })
      .toArray();

    res.status(200).json({ success: true, data: rawData });
  } catch (err) {
    console.error("❌ Direct query error:", err.message);
    res.status(500).json({ success: false, message: "DB query failed" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
