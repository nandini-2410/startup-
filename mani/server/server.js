const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // To serve signup.html and others

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/usersignup", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// ✅ Schema + Model directly in server.js
const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  username: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

// POST route to save user
app.post("/api/signup", async (req, res) => {
  const { name, surname, username, password } = req.body;

  try {
    const newUser = new User({ name, surname, username, password });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving user", error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
