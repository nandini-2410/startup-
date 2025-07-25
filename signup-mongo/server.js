const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/contracts', express.static(path.join(__dirname, 'public/contracts')));

app.use(session({
  secret: 'nandini', // use a random string here
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set true only with HTTPS
}));

app.get('/register', (req, res) => {
 if (!req.session.user) {
    return res.redirect('/signin.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/signupDB')
.then(() => console.log('Connected to MongoDB: signupDB'))
  .catch((err) => console.error('MongoDB connection error (signupDB):', err));


const registerOffConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/registeroff');


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
  info: String,
  fund: Number,
  st: Number,
  rd: Number
});
const Startup = registerOffConnection.model('Startup', startupSchema);

// let tempSession = null;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','home.html'));
});

app.get('/resource', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','resources.html'));
});

app.get('/navigator', (req, res) => {
 if (!req.session.user) {
    return res.redirect('/signin.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'navigator.html'));
});


app.get('/onchain', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/signin.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'onchain.html'));
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
    res.redirect('/signin.html');

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

   req.session.user = {
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
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).send("❌ No active session.");
  }
});




app.post('/post', async (req, res) => {
  const { name, email, idea, info, fund, st, rd } = req.body;
  try {
    const newStartup = new Startup({ name, email, idea, info, fund, st, rd });
    await newStartup.save();
    console.log(newStartup);
    res.send("Startup registration successful!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to register startup.");
  }
});

app.get("/get-startups", (req, res) => {
  const results = [];

  fs.createReadStream("startups.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    })
    .on("error", (err) => {
      console.error("CSV Read Error:", err);
      res.status(500).send("Error reading CSV file");
    });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Failed to log out.");
    }
    res.redirect('/signin.html');
  });
});

app.listen(port, () => {
  console.log(` Unified server running at http://localhost:${port}`);
});
