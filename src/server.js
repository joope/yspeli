var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/', express.static(path.join(__dirname, 'static')))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/client.html');
});

app.get('/host', function(req, res){
  res.sendFile(__dirname + '/static/host.html');
});

io.on('connection', function(socket){
  var playerID = socket.id;
  console.log(playerID + ' connected');
  socket.on('control', function(control){
    io.emit('control_event', {
      id : playerID,
      v : control.v,
      d: control.d
    })
  })

  // Pass the triggersound message (sent by host) to all clients
  socket.on('triggersound', function(msg) {
    socket.broadcast.emit('playsound', msg);
  });
  socket.on('disconnect', function(){
    io.emit('player_disconnect', playerID);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
