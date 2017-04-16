const Socket = require("./socket");
const LightServer = require("./lightServer");

var socket = new Socket();
socket.init();

var lightServer = new LightServer(socket);
