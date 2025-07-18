const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  username: { type: String, required: true, unique: true },
  password: String,
});

module.exports = mongoose.model("User", userSchema);
