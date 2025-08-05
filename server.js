const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // adjust this to the correct value
    methods: ['GET', 'POST']
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('ZoroBeats Socket.IO server is running!');
});

io.on('connection', (socket) => {
  try {
    socket.on('join-room', (room) => {
      if (!socket.rooms.has(room)) {
        socket.join(room);
      }
    });

    socket.on('sync-play-youtube', (room) => {
      socket.to(room).emit('play-youtube');
    });

    socket.on('sync-pause-youtube', (room) => {
      socket.to(room).emit('pause-youtube');
    });
  } catch (error) {
    console.error(error);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});