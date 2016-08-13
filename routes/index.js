var express = require('express');
var router = express.Router();
var path = require('path');
var Player = require('./Player');
var fs = require('fs');
var folderPath = path.join(__dirname, '/../music/');
var mime = require('mime');
var Song = require('./Song');
var Events = require('events');
var EventEmitter = new Events.EventEmitter();
var Socket = require('./WebSocket');
var playlist = [];

var songMimeTypes = [
    'audio/mpeg'
];

function findSongFiles (files, folderPath, callback) {
    var songsList = [];
    files.forEach(function (file) {
        var fullFilePath = path.resolve(folderPath,file);
        var extension = mime.lookup(fullFilePath);
        if (songMimeTypes.indexOf(extension) !== -1) {
        	var song = new Song(file, fullFilePath);
            songsList.push(song);
        }
        if (files.indexOf(file) === files.length-1) {
            callback(songsList);
        }
    });
}

function findAllFiles(folderPath, callback){
	// Read folder files
	fs.readdir(folderPath, function (err, files) {
		if (err) { return callback(err, null); }
		callback(null, files);
	});
}

function initMain(){
	findAllFiles(folderPath, function(err, files){
		if(err){return console.log(err)}
		findSongFiles(files, folderPath, function(files){
			//console.log(files);
			files.forEach(function(item){
				playlist.push(item);
				Player.addToPlaylist(item.filePath);
			});
		});
	});

	Player.eventEmitter.on('back', function(index){
		console.log('Event: Back');
	});
	Player.eventEmitter.on('play', function(index){
		console.log('Event: Playing');
		Socket.emitSong(playlist[index]);
	});
	Player.eventEmitter.on('next', function(index){
		console.log('Event: Next');
	});
}

initMain();


router.get('/', function(req, res, next) {
  res.render('index', {title:'Teste'});
});

router.get('/back', function(req, res, next) {
	Player.backward();
	res.status(200).send('OK');
});

router.get('/play', function(req, res, next) {
	Player.play();
	res.status(200).send('OK');
});

router.get('/pause', function(){
	Player.pause();
	res.status(200).send('OK');
});

router.get('/next', function(req, res, next) {
	Player.forward();
	res.status(200).send('OK');
});

module.exports = router;
