import dotenv from 'dotenv';
import express from 'express';
import http from 'http'; // Import http
import cors from 'cors';
import { Server } from "socket.io"; // Import Server from socket.io
import apiRoutes from './routes/api.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Make `io` available to our routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', apiRoutes);

// Connect to the database
connectDB();

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Listen on the http server, not the express app
server.listen(PORT, () => console.log(`🚀 Server with Socket.IO running on port ${PORT}`));