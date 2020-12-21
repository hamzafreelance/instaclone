const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
//const http = require('http');

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(cors({ origin: '*' }));
//app.use(cors);
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// DB Config
const db = require('./config/keys').MONGO_URI;
console.log(db);
// Connect to MongoDB
mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  const users = require('./routes/users');
  const posts = require('./routes/posts');
  const profile = require('./routes/profile');
  const chat = require('./routes/chat');
  const comments = require('./routes/comments');

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);


// Use Routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/chat', chat);
app.use('/api/profile', profile);
app.use('/api/comments', comments);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else {
  app.use(express.static('uploads'));
  app.use(express.static('frontend/build'));
}

const port = process.env.PORT || 5000;



http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

io.on("connection", (socket) => { 
  
  socket.on("send-message", ({message, chatId}) => {
    socket.emit('receive-message', message);
  });
  socket.on("is-typing", (data) => {
    socket.emit('user-typing', data);
  });
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


