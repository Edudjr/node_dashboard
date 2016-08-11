var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'Teste'});
  //res.sendFile(path.join(__dirname+'/../views/index.html'));
});

router.get('/back', function(req, res, next) {
	console.log('BACK');
});

router.get('/play', function(req, res, next) {
  res.render('index', {title:'Teste'});
  //res.sendFile(path.join(__dirname+'/../views/index.html'));
});

router.get('/next', function(req, res, next) {
  res.render('index', {title:'Teste'});
  //res.sendFile(path.join(__dirname+'/../views/index.html'));
});

module.exports = router;
