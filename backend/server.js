const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const cors = require("cors");

app.use(express.json());
app.use(cors({origin:[process.env.FRONTEND_URL]}))
// env variable for maintaining secrecy 
const db_url = process.env.DB_URL;
const jwt_secret = process.env.JWT_SECRET;

// MongoDB connection
mongoose.connect(db_url, {

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Note Schema
const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  tasks: {
    complete: [String],
    pending: [String]
  }
});

const Note = mongoose.model('Note', noteSchema);

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
});

const User = mongoose.model('User', userSchema);

// Authorization Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

// Routes
app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, jwt_secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/notes', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('notes');
    res.json(user.notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/notes', auth, async (req, res) => {
  const { title, description, tasks } = req.body;


  const newNote = new Note({
    title,
    description,
    tasks: {
      complete: tasks ? tasks.complete || [] : [],
      pending: tasks ? tasks.pending || [] : []
    }
  });

  try {
    const savedNote = await newNote.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { notes: savedNote._id } });
    res.json(savedNote);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/notes/:id',auth, async(req,res)=>{
  const { id } = req.params;
  const { title, description, tasks} = req.body;
  const user = await User.findById(req.user.id);
  const notes = user.notes;
  console.log(notes);
  if(notes.indexOf(id) != -1){
    try {
      const note = await Note.findByIdAndUpdate(
        id,
        { title, description, tasks:tasks || {complete:[],pending:[]} },
        { new: true }
      );
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
  else{
    res.status(401).json({message:'No task found'});
  }

})

app.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('notes');
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
