var dateFormat = require('dateformat');

function updateClock(){
	var clockLabel = document.getElementById('div_hour');
	var p = clockLabel.getElementsByTagName('p')[0];
	var now = new Date();
	p.innerHTML = dateFormat(now, "h:MM");
}

function updateSong(){
	$.get( "/update", function( data ) {
		console.log(data);
		var songDiv = document.getElementById('div_song');
		var songP = songDiv.getElementsByTagName('p')[0];
		songP.innerHTML = data.song;

		var artistDiv = document.getElementById('div_artist');
		var artistP = artistDiv.getElementsByTagName('p')[0];
		artistP.innerHTML = data.artist;
	});
}

function back(){
	$.get( "/back", function( data ) {
		console.log('Back');
	});
}
function play(){
	$.get( "/play", function( data ) {
		console.log('Playing');
	});
}
function next(){
	$.get( "/next", function( data ) {
		console.log('Next');
	});
}

window.onload = function(){
	updateClock();
	updateSong();

	setInterval(updateClock, 60000);
	$('#back_button').click(back);
	$('#play_button').click(play);
	$('#next_button').click(next);
}