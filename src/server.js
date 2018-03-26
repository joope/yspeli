var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/client.html');
});

app.get('/host', function(req, res){
  res.sendFile(__dirname + '/static/host.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('control', function(control){
    io.emit('control_event', {
      id : socket.id,
      v : control.v,
      d: control.d
    })
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
