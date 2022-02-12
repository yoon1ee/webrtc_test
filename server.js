const express = require('express');
const app = express();
const { v4: uuidV4 } = require('uuid');

//https - http
const http = require('http');
const server = http.createServer(app);
// const fs = require('fs');
// const server = https.createServer(
//     {
//       key: fs.readFileSync('/etc/letsencrypt/live/192.249.31.66:3000//privkey.pem'),
//       cert: fs.readFileSync('/etc/letsencrypt/live/192.249.31.66:3000//cert.pem'),
//       ca: fs.readFileSync('/etc/letsencrypt/live/192.249.31.66:3000//chain.pem'),
//       requestCert: false,
//       rejectUnauthorized: false,
//     },
//     app
//   );

const io = require('socket.io')(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('puiblic'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});

server.listen(3000);