var io = null;

var WebSocket = function(io){
	this.io = io;

	io.on('connection', function(socket){
		console.log('a user connected');
		socket.on('disconnect', function(){
			console.log('user disconnected');
		});
	});
}

module.exports = WebSocket;