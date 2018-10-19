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

const serverIds = {};
const serverConnectionIds = {};

let connections = 0;

io.on('connection', function(socket){
  var connectionID = socket.id;
  connections++;
  console.log(connections);

  socket.on('registerServer', function(callback){ 
    console.log('register server', connectionID)
    var serverId = 'AAAA';
    if (Object.keys(serverIds).length > 0) {
      var serverId = randomString(4);
    }
    serverIds[serverId] = connectionID;
    serverConnectionIds[connectionID] = serverId;
    callback(serverId);
  });

  socket.on('registerClient', function(serverId, callback) {
    console.log('register client', connectionID, serverId)
    if (serverIds[serverId]){
      callback(serverIds[serverId]);
    } else {
      callback(null);
    }
  });
  
  socket.on('peerMessage', function(targetID, data) {
    io.to(targetID).emit('peerMessage', connectionID, data);
  });

  socket.on('disconnect', function(){
    console.log(connectionID, 'disconnected');

    delete serverIds[serverConnectionIds[connectionID]];
    delete serverConnectionIds[connectionID];

    connections--;
    console.log(connections);
  });
});

function randomString(length) {
    var chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

http.listen(3000, function(){
  console.log('listening on :3000');
});
