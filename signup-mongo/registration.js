require('dotenv').config({ path: __dirname + '/.env' });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.REG_PORT ;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI_REGISTER)
  .then(() => console.log("Connected to registeroff DB"))
  .catch(err => console.error("MongoDB Error:", err));



const registerOffConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/registeroff', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

registerOffConnection.once('open', () => {
  console.log(' Connected to MongoDB: registeroff');
});

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema); 

const startupSchema = new mongoose.Schema({
  name: String,
  email: String,
  idea: String,
  info: String
});
const Startup = registerOffConnection.model('Startup', startupSchema);

let tempSession = null;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'HOME.html'));
});

app.post('/signup', async (req, res) => {
  const { name, surname, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("⚠️ User already exists.");
    }

    const newUser = new User({ name, surname, username, password });
    await newUser.save();
    res.status(200).sendFile(path.join(__dirname, 'signin.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send(" Error registering user.");
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send("Invalid credentials.");
    }

    tempSession = {
      username: user.username,
      signedInAt: new Date().toLocaleString()
    };

    res.send("Signed in successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during sign-in.");
  }
});

app.get('/session', (req, res) => {
  if (tempSession) {
    res.json(tempSession);
  } else {
    res.status(401).send("❌ No active session.");
  }
});


app.post('/post', async (req, res) => {
  const { name, email, idea, info } = req.body;
  try {
    const newStartup = new Startup({ name, email, idea, info });
    await newStartup.save();
    console.log(newStartup);
    res.send("✅ Startup registration successful!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to register startup.");
  }
});


app.listen(PORT, () => console.log(`Registration server running on port ${PORT}`));
