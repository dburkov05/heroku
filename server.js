var port = process.env.PORT || 80;
// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', port);
app.use('/', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  //response.sendFile(path.join(__dirname, 'index.html'));
  res.send('Hello World!');
});

server.listen(port, function() {
  console.log('Starting server on port '+port);
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
