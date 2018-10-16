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

let serverIds = {};
let clients = {};

io.on('connection', function(socket){

  var connectionID = socket.id;

  socket.on('registerServer', function(callback){ 
    console.log('register server', connectionID)
    var serverId = 'AAAA';
    // if (Object.keys(serverIds).length > 0) {
    //   var serverId = randomString(4);
    // }
    serverIds[serverId] = connectionID;
    callback(serverId);
  });

  socket.on('registerClient', function(serverId, callback) {
    console.log('register client', connectionID)
    callback(serverIds[serverId]);
  });
  
  socket.on('peerMessage', function(targetID, data) {
    console.log('peerMessage', connectionID, targetID, data)
    io.to(targetID).emit('peerMessage', connectionID, data);
  });

  socket.on('control', function(control) {
    if (!clients[connectionID]) return;
    serverId = getServerId(connectionID);
    io.to(serverId).emit('control_event', {
      id : connectionID,
      v : control.v,
      d: control.d
    })
  })
  // Pass the triggersound message (sent by host) to all clients
  socket.on('triggersound', function(msg) {
    socket.broadcast.emit('playsound', msg);
  });
  socket.on('crash', function(connectionID) {
    io.to(connectionID).emit('crash');
  })
  socket.on('disconnect', function(){
    console.log(connectionID, 'disconnected');
    if (serverIds[connectionID]) {
        delete serverIds.connectionID;
        return;
    }
    // io.to(getServerId(connectionID)).emit('player_disconnect', connectionID);
  });
});

function getServerId(connectionID) {
    var serverId = clients[connectionID] ? clients[connectionID].serverId : 'AAAA';
    return serverIds[serverId];
}

function randomString(length) {
    var chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

http.listen(3000, function(){
  console.log('listening on :3000');
});
