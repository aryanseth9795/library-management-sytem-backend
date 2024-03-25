const mongoose = require("mongoose");
const borrowschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  borrowStatus: {
    type: String,
    required: true,
    default: "Requested",
  },
  bookItems: {},

  borrowAt: String,
  createdAt: {
    type: String,
    default: new Date().toLocaleDateString()
  },
});

module.exports = mongoose.model("borrow", borrowschema);
