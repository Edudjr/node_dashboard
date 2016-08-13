var io = null;
module.exports = {
	configure: function(io){
		this.io = io;
		io.on('connection', function(socket){
			console.log('a user connected');
			socket.on('disconnect', function(){
				console.log('user disconnected');
			});
		});
	},

	emitSong: function(song) {
		this.io.emit('play', song);
	}
}