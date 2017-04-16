const ws = require('nodejs-websocket');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var socketServer;

module.exports = Socket;

function Socket(){
  EventEmitter.call(this);
}

inherits(Socket, EventEmitter);

Socket.prototype.init = function(){
  var self = this;
  socketServer = ws.createServer(function (conn) {
  	console.log('New connection established.', new Date().toLocaleTimeString());

    //send status on connection
    self.emit('new');

  	conn.on('text', function (msg) {
      console.log(JSON.stringify(msg));
      self.emit('change', msg);
    });

  	conn.on('close', function (code, reason) {
  		console.log('Chat connection closed.', new Date().toLocaleTimeString(), 'code: ', code);
  	});

  	conn.on('error', function (err) {
  		// only throw if something else happens than Connection Reset
  		if (err.code !== 'ECONNRESET') {
  			console.log('Error in Chat Socket connection', err);
  			throw  err;
  		}
  	})
  }).listen(3005, function () {
  	console.log('Chat socketserver running on localhost:3005');
  });
}

Socket.prototype.notify = function(status){
  if (socketServer.connections.length > 0) {
      socketServer.connections.forEach((function (conn) {
      console.log('status: ' + status);
      conn.send(JSON.stringify(status));
    }));
  }
}
