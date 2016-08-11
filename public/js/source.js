var dateFormat = require('dateformat');

function updateClock(){
	var clockLabel = document.getElementById('div_hour');
	var p = clockLabel.getElementsByTagName('p')[0];
	var now = new Date();
	p.innerHTML = dateFormat(now, "h:MM");
}

window.onload = function(){
	updateClock();

	setInterval(updateClock, 60000);
}