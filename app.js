var express = require('express');
var app = express();
var path = require('path');
//var server = require('http').createServer(app);

users = [];
connections = [];

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/main.html'))
})

var server = app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!')
})

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  connections.push(socket);
  console.log('Sockets Connected: %s', connections.length);

  socket.on('disconnect', function() {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Sockets Connected: %s', connections.length);
  });

  socket.on('send message', function(data){
    io.emit('new message', {msg: data, user : socket.username});
  });

  //New user entered
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.emit('get users', users);
  }
});
