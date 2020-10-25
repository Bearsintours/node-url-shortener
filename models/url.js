const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
