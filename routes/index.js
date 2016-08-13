var express = require('express');
var router = express.Router();
var path = require('path');
var Player = require('player');
//var fs = require('fs');
//var folderPath = path.join(__dirname, '/../music/');
 
// create a player instance from playlist 
//var player = Player([]);

// Read folder files
// fs.readdir(folderPath, function (err, files) {
//     if (err) { return cb(err, null); }
//     //cb(null, files);
//     console.log(files);
// });
//player.add(path.join(__dirname,'/../music/'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'Teste'});
  //res.sendFile(path.join(__dirname+'/../views/index.html'));
});

router.get('/back', function(req, res, next) {
	console.log('BACK');
});

router.get('/play', function(req, res, next) {
  	// play now and callback when playend 
	// player.play(function(err, player){
	//   console.log('playend!');
	// });
});

router.get('/next', function(req, res, next) {
	player.next();
});

module.exports = router;
