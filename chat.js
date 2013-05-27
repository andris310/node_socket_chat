var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(1234);

// routing

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/css', function (req, res) {
  res.sendfile(__dirname + '/style.css');
});

//

var users = {};

io.sockets.on('connection', function(socket){
  socket.on('sendchat', function(data){
    io.sockets.emit('updatechat', socket.user, data);
  });
  socket.on('adduser', function(user){
    socket.user = user;
    users[user] = user;
    socket.emit('updatechat', 'SERVER', 'you are connected');
    socket.broadcast.emit('updatechat', 'SERVER', user + 'has connected');
    io.sockets.emit('updateusers', users);
  });

  socket.on('disconnect', function(){
    delete users[socket.user];
    io.socket.emit('updateusers', users);
    socket.broadcast.emit('updatechat', 'SERVER', socket.user + 'has disconnected');
  });
});

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

