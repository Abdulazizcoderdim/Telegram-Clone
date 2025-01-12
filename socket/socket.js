const io = require('socket.io')(5000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let users = [];

io.on('connection', socket => {
  console.log(`user connected: ${socket.id}`);

  socket.on('addOnlineUser', user => {
    console.log('USer added', user);
  });
});
