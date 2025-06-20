const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const cron = require("node-cron");
const DataModel = require("../shared/models/DataModel");

// Configuration
const config = {
  DATA_DIR: path.join(__dirname, "./data"),
  FILE_NAME: "data-file.xlsx",
  CRON_SCHEDULE: "*/2 * * * * *", // Every 2 seconds
  MONGODB_URI:
    "mongodb+srv://asherdntrk:3k4oeR1naWvBLmzQ@cluster0.byggpdg.mongodb.net/FileMonitor?retryWrites=true&w=majority",
  MONGO_OPTIONS: {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    maxPoolSize: 5,
    retryWrites: true,
    retryReads: true,
    connectTimeoutMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  },
};

// Enable mongoose debugging
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

// MongoDB connection handler
async function connectToMongoDB() {
  try {
    await mongoose.connect(config.MONGODB_URI, config.MONGO_OPTIONS);
    console.log("✅ MongoDB connection established");
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    return false;
  }
}

// Process Excel file with robust error handling
async function processExcelFile() {
  const filePath = path.join(config.DATA_DIR, config.FILE_NAME);
  const startTime = Date.now();

  console.log(
    `\n⏳ [${new Date().toISOString()}] Processing file: ${config.FILE_NAME}`
  );

  try {
    // Verify connection
    if (mongoose.connection.readyState !== 1) {
      console.log("ℹ️ Attempting MongoDB reconnection...");
      if (!(await connectToMongoDB())) {
        console.log("⚠️ Skipping this run due to connection issues");
        return;
      }
    }

    // File existence check
    if (!fs.existsSync(filePath)) {
      console.log("ℹ️ File not found, skipping");
      return;
    }

    // Read Excel data
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    function convertExcelDate(serial) {
      // Excel date serial to JS Date
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      return new Date(excelEpoch.getTime() + serial * 86400 * 1000);
    }

    function convertExcelTime(fraction) {
      const totalSeconds = Math.round(fraction * 24 * 60 * 60);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return [hours, minutes, seconds]
        .map((v) => String(v).padStart(2, "0"))
        .join(":"); // "HH:mm:ss"
    }

    const excelData = rawData.map((row) => {
      const formatted = { ...row };

      if (typeof row.Date === "number") {
        formatted.Date = convertExcelDate(row.Date); // JS Date object
      }

      if (typeof row.Time === "number") {
        formatted.Time = convertExcelTime(row.Time); // "HH:mm:ss"
      }

      return formatted;
    });

    console.log(`📊 Extracted ${excelData.length} records`);

    // Prepare document
    const doc = {
      fileName: config.FILE_NAME,
      fileType: "xlsx",
      content: excelData,
      lastUpdated: new Date(),
      recordsCount: excelData.length,
    };

    // Direct collection access with timeout
    const collection = mongoose.connection.db.collection("excel_files");
    const options = {
      upsert: true,
      returnDocument: "after",
      maxTimeMS: 30000,
    };

    const result = await collection.findOneAndUpdate(
      { fileName: doc.fileName },
      { $set: doc },
      options
    );

    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Update successful (${processingTime}s)`);
    console.log(
      `   - Modified: ${result.lastErrorObject.updatedExisting ? "Yes" : "No"}`
    );
    console.log(`   - Records: ${doc.recordsCount}`);
  } catch (err) {
    console.error(`❌ Processing failed:`, err.message);

    // Reset connection if error is MongoDB-related
    if (err.name.includes("Mongo")) {
      console.log("ℹ️ Resetting MongoDB connection");
      await mongoose.disconnect();
    }
  }
}

// Initialize and start processing
(async function main() {
  // Connection events for debugging
  mongoose.connection.on("connected", () => {
    console.log("Mongoose event: Connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose event: Disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose event error:", err);
  });

  // Initial connection
  const connected = await connectToMongoDB();
  if (connected) {
    console.log(`⏰ Starting cron job (${config.CRON_SCHEDULE})`);
    cron.schedule(config.CRON_SCHEDULE, processExcelFile);

    // Initial run
    await processExcelFile();
  } else {
    console.log("Failed to establish initial connection");
    process.exit(1);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down...");
  await mongoose.disconnect();
  process.exit(0);
});
