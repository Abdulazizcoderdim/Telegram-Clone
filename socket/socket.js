const io = require('socket.io')(5000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
