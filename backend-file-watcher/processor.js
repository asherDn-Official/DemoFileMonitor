const mongoose = require("mongoose");
const SerialPort = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// MongoDB Setup
const MONGO_URI =
  "mongodb+srv://bhuvan:Semicon25@cluster0.pbfgnc7.mongodb.net/EsdMonitor?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

// Define Schema
const logSchema = new mongoose.Schema({
  DeviceID: Number,
  Connected: String,
  Date: String, // Format: YYYYMMDD
  Time: String, // Format: HH:mm:ss
  Operator1: String,
  Operator2: String,
  Mat1: String,
  Mat2: String,
});

const DeviceLog = mongoose.model("DeviceLog", logSchema);

// Serial Port Setup
const port = new SerialPort.SerialPort({
  path: "COM3",
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: ":" }));

// Transform functions
function getCurrentDate() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getDate()).padStart(2, "0")}`;
}

function getCurrentTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function mapValue(val) {
  if (val === "FAIL") return "No";
  if (val === "PASS") return "Yes";
  return "NC"; // Not Connected or unknown
}

// Parse serial data
parser.on("data", async (line) => {
  console.log(`📥 Received: ${line.trim()}`);

  const parts = line.trim().split(",");
  const deviceID = parseInt(parts[0], 10);
  const dataValues = parts.slice(1).map(mapValue);

  // Build logEntry dynamically based on data length
  const logEntry = {
    DeviceID: deviceID,
    Connected: dataValues.includes("Yes") ? "Yes" : "No",
    Date: getCurrentDate(),
    Time: getCurrentTime(),
  };

  const fieldNames = ["Operator1", "Operator2", "Mat1", "Mat2"];
  fieldNames.forEach((field, index) => {
    if (index < dataValues.length) {
      logEntry[field] = dataValues[index];
    }
  });

  try {
    await DeviceLog.findOneAndUpdate(
      { DeviceID: logEntry.DeviceID },
      { $set: logEntry },
      { upsert: true, new: true }
    );
    console.log("✅ Data inserted/updated:", logEntry);
  } catch (err) {
    console.error("❌ Failed to insert/update data:", err.message);
  }
});

// Graceful exit
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down...");
  await mongoose.disconnect();
  port.close(() => {
    console.log("🔌 Serial port closed");
    process.exit(0);
  });
});
