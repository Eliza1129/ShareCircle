const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const auth = require('./middleware/auth');

// Import Routes
const userRoutes = require('./routes/user'); // User routes
const itemRoutes = require('./routes/item'); // Item routes

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST','PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  },
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Mount Routes
// 配置静态文件路径
app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));
app.use('/users', userRoutes); // Routes for user-related actions (e.g., register, login)
app.use('/items', itemRoutes); // Routes for item-related actions (protected by auth)


// Real-Time Chat with Socket.IO
let users = {}; // Keep track of connected users

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Handle user joining a chat room
  socket.on('joinRoom', ({ username, room }) => {
    users[socket.id] = { username, room }; // Track the user's room
    socket.join(room);
    console.log(`${username} joined room: ${room}`);
    io.to(room).emit('message', { sender: 'System', message: `${username} has joined the chat.` });
  });

  // Handle user sending a message
  socket.on('sendMessage', ({ room, message, sender }) => {
    io.to(room).emit('message', { sender, message }); // Broadcast the message to the room
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username, room } = users[socket.id];
      console.log(`${username} disconnected from room: ${room}`);
      delete users[socket.id];
      io.to(room).emit('message', { sender: 'System', message: `${username} has left the chat.` });
    }
  });
});

// Log all registered routes (for debugging)
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`Registered route: ${middleware.route.path}`);
  }
});

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


