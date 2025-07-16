import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AjnabiCam Server is running!');
});

// Store connected users
const connectedUsers = new Map();
const waitingUsers: string[] = [];
const activeConnections = new Map(); // Track active peer connections

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  connectedUsers.set(socket.id, {
    id: socket.id,
    isPremium: false,
    genderFilter: 'any'
  });

  // Handle user profile updates
  socket.on('user:profile', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.set(socket.id, { ...user, ...data });
    }
  });

  // Handle matching logic
  socket.on('find:match', () => {
    if (waitingUsers.length > 0) {
      const partnerId = waitingUsers.shift();
      if (partnerId && partnerId !== socket.id) {
        // Match found
        activeConnections.set(socket.id, partnerId);
        activeConnections.set(partnerId, socket.id);
        socket.emit('user:connect', partnerId);
        io.to(partnerId).emit('user:connect', socket.id);
      }
    } else {
      waitingUsers.push(socket.id);
    }
  });

  // Handle WebRTC signaling
  socket.on('offer', ({ offer, to }) => {
    if (connectedUsers.has(to)) {
      io.to(to).emit('offer', { offer, from: socket.id });
    }
  });

  socket.on('answer', ({ answer, to }) => {
    if (connectedUsers.has(to)) {
      io.to(to).emit('answer', { answer, from: socket.id });
    }
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    if (connectedUsers.has(to)) {
      io.to(to).emit('ice-candidate', { candidate, from: socket.id });
    }
  });

  // Handle peer negotiation
  socket.on('peer:nego:needed', ({ offer, targetChatToken }) => {
    if (connectedUsers.has(targetChatToken)) {
      io.to(targetChatToken).emit('peer:nego:needed', { offer, from: socket.id });
    }
  });

  socket.on('peer:nego:done', ({ answer, to }) => {
    if (connectedUsers.has(to)) {
      io.to(to).emit('peer:nego:final', { answer, from: socket.id });
    }
  });

  // Handle messages
  socket.on('send:message', ({ message, targetChatToken, isSecret, messageId }) => {
    if (connectedUsers.has(targetChatToken)) {
      io.to(targetChatToken).emit('message:recieved', {
        message,
        from: socket.id,
        isSecret: isSecret || false,
        messageId
      });
    }
  });

  // Handle premium status sharing
  socket.on('send:premium:status', ({ isPremium, targetChatToken }) => {
    if (connectedUsers.has(targetChatToken)) {
      io.to(targetChatToken).emit('partner:premium:status', { isPremium });
    }
  });

  // Handle stay connected requests
  socket.on('stay:connected:response', ({ wantToStay, targetChatToken }) => {
    if (connectedUsers.has(targetChatToken)) {
      io.to(targetChatToken).emit('stay:connected:response', { 
        wantToStay, 
        from: socket.id 
      });
    }
  });

  // Handle skip
  socket.on('skip', () => {
    const partnerId = activeConnections.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('skipped');
      activeConnections.delete(socket.id);
      activeConnections.delete(partnerId);
    }
    
    // Remove from waiting list if present
    const index = waitingUsers.indexOf(socket.id);
    if (index > -1) {
      waitingUsers.splice(index, 1);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up active connections
    const partnerId = activeConnections.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('partnerDisconnected');
      activeConnections.delete(partnerId);
    }
    activeConnections.delete(socket.id);
    
    connectedUsers.delete(socket.id);
    
    // Remove from waiting list if present
    const index = waitingUsers.indexOf(socket.id);
    if (index > -1) {
      waitingUsers.splice(index, 1);
    }
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});