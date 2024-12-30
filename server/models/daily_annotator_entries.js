const mongoose = require("mongoose");
const Folder = require("./Folder");
// mongoose.set('strictQuery',true);

var dailyEntries = mongoose.Schema({
  Folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "folder",
    required: true,
  },
  annotator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "labeler",
    required: true,
  },
  totalLabeledImageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("dailyEntry", dailyEntries);
