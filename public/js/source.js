var dateFormat = require('dateformat');
var now = new Date();

window.onload = function(){
	// Basic usage 
	console.log(dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
}