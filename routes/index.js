var express = require('express');
var router = express.Router();
var path = require('path');
var Player = require('./Player');
var fs = require('fs');
var folderPath = path.join(__dirname, '/../music/');
var mime = require('mime');
var Song = require('./Song');
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
		console.log(files);
	});
}

initMain();


router.get('/', function(req, res, next) {
  res.render('index', {title:'Teste'});
});

router.get('/back', function(req, res, next) {
	console.log('BACK');
});

router.get('/play', function(req, res, next) {
	var songName = 'Eagles of Death Metal - Save A Prayer.mp3';
	console.log(songName);
	Player.addToPlaylist(path.join(__dirname, '/../music/'+songName));
	Player.play();
});

router.get('/pause', function(){
	Player.pause();
});

router.get('/next', function(req, res, next) {
	player.next();
});

module.exports = router;
