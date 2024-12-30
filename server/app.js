var createError = require('http-errors');
var cors = require('cors')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
const dotenv = require('dotenv');

const http = require('http')
const { Server } = require('socket.io'); // Import Socket.IO

// Load environment variables from .env file
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// Set up HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your Vite dev server URL
    methods: ["GET", "POST"]
  }
}
);

// Attach io instance to the app for later use in routes
app.set('io', io);

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected');

    // Example: Listen for a message from the client
    socket.on('message', (data) => {
      console.log(`Message from client: ${data}`);
      socket.emit('response', `Hello from server!`);
    });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware to parse form data (before Multer)
app.use(express.json());  // Parse JSON bodies (for JSON requests)
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies (for form submissions)

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());





// Static folder for public assets
app.use(express.static(path.join(__dirname, 'public')));

// Logger, cookie parser, and error handling
app.use(logger('dev'));
app.use(cookieParser());

// Route handlers
app.use('/', indexRouter);
app.use('/users', usersRouter);



// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// General error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, server };
