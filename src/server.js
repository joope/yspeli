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
let players = {};

io.on('connection', function(socket){
  var playerID = socket.id;
  console.log(playerID + ' connected');
  socket.on('control', function(control) {
    if (!players[playerID]) return;
    serverId = getServerId(playerID);
    io.to(serverId).emit('control_event', {
      id : playerID,
      v : control.v,
      d: control.d
    })
  })
  socket.on('register', function(data) {
    players[playerID] = {name: data.name, serverId: data.serverId};
    io.to(serverIds[data.serverId]).emit('register', {
      playerID: playerID, name: data.name, emoji: data.emoji
    });
    console.log(serverIds);
    console.log(players);
  });
  socket.on('registerServer', function(callback){
    var serverId = 'AAAA';
    if (Object.keys(serverIds).length > 0) {
        var serverId = randomString(4);
    }
    serverIds[serverId] = socket.id;
    callback(serverId);
  })
  // Pass the triggersound message (sent by host) to all clients
  socket.on('triggersound', function(msg) {
    socket.broadcast.emit('playsound', msg);
  });
  socket.on('crash', function(playerID) {
    io.to(playerID).emit('crash');
  })
  socket.on('disconnect', function(){
    if (serverIds[playerID]) {
        delete serverIds.playerID;
        return;
    }
    io.to(getServerId(playerID)).emit('player_disconnect', playerID);
  });
});

function getServerId(playerID) {
    var serverId = players[playerID] ? players[playerID].serverId : 'lolol';
    return serverIds[serverId];
}

function randomString(length) {
    var chars = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

http.listen(3000, function(){
  console.log('listening on :3000');
});
