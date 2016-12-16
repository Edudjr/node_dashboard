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

var backgroundImageIndex = 0;
var host = 'http://localhost:3001/images/'
var backgroundImages = [
	'001.jpg',
	'002.jpg',
	'003.jpg',
	'004.jpg'
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

function backgroundImageTransition(){
	if(backgroundImageIndex < backgroundImages.length-1){
		backgroundImageIndex++;
	}else{
		backgroundImageIndex = 0;
	}
	Socket.emitBackgroundTransition(host+backgroundImages[backgroundImageIndex]);
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
	//Change background every X miliseconds
	setInterval(backgroundImageTransition, 30000);

	//Player events
	Player.eventEmitter.on('back', function(index){
		console.log('Event: Back');
	});
	Player.eventEmitter.on('play', function(index){
		console.log('Event: Playing');
		var json = {
			song: playlist[index].song,
			artist: playlist[index].artist,
			duration: Player.getDuration(),
			durationInSeconds: Player.getDurationInSeconds()
		}
		Socket.emitSong(json);
	});
	Player.eventEmitter.on('next', function(index){
		console.log('Event: Next');
	});
}

initMain();


router.get('/', function(req, res, next) {
	Player.stop();
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

router.get('/update', function(req, res, next){
	var index = Player.getSongIndex();
	res.json(playlist[index]);
});

module.exports = router;
