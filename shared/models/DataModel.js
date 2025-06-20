const mongoose = require("mongoose");

const excelDataSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fileType: {
      type: String,
      default: "xlsx",
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    lastUpdated: {
      type: Date,
      required: true,
      index: true,
    },
    recordsCount: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "excel_files", // IMPORTANT
    timestamps: false,
    bufferCommands: true,
  }
);

// Don't use different model name here unless intentional
const DataModel = mongoose.model("ExcelData", excelDataSchema);

module.exports = DataModel;
