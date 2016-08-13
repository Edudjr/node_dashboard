var express = require('express');
var router = express.Router();
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var EventEmitter = require("events").EventEmitter;
//var audioMetaData = require('audio-metadata');
var currentIndex = 0;

var STATE = {
    playing : 0,
    paused : 1,
    stopped : 2
}; 

var stream = null;
var lastMusic = null;
var currentState = STATE.stopped;
var playlist = [];   


exports.play = function(index){
    playH(index);
}
exports.resume = function(){
    resumeH();
}
exports.pause = function(){
    pauseH();
}
exports.stop = function(){
    stopH();
}

exports.backward = function(){
    stopH();
    previous();
    playH();
}

exports.forward = function(){
    stopH();
    next();
    playH();
} 

exports.getState = function(){
   return currentState;
}

exports.getSongIndex = function(){
    return lastMusic;
}

exports.addToPlaylist = function(file){
    playlist.push(file);
}

//NAO EH IDEAL - USAR REGEX
exports.getMetadata = function(audio){
    //var audioData = fs.readFileSync(audio);
    //var metadata = audioMetaData.id3v2(audioData);

    //console.log(metadata);
    //var getInfo = "(?=Alt-J).*(?=.mp3)";
    //var title = "[^/]*(?= -)";
    //var song = "(?=- )(.*)?()"; //FIX IT

    //get rid of path - [^/]*.mp3
    //get (title)(song) - ^([^-]+) - (.*).mp3

    var data = {};
    var artistReg = '/.*-';
    var artist = audio.match(artistReg);
    var song = artist.replace(artist, "");
    artist = artist.slice(0, -1);
    console.log(artist);
    console.log(song);
    
    // //if regex worked, get title and song names
    // if (match != null){
    //     var tempFinal = tempNoPath[0].match(/^([^-]+) - (.*).mp3/i);
    //     if(tempFinal != null && tempFinal[1] && tempFinal[2]){
    //         tempTitle = tempNoPath[0].match(/^([^-]+) - (.*).mp3/i)[1];
    //         tempSong = tempNoPath[0].match(/^([^-]+) - (.*).mp3/i)[2];
    //     }else{
    //         console.log(audio);
    //     }
    // }

    // data.title = tempTitle ?  tempTitle : tempNoPath;
    // data.song = tempSong ? tempSong : tempNoPath;

    // return data;
}

function playH(index){
    //if index is null, play from playlist. If both null, return
	if (!index || (typeof index ==='undefined')){ 
        index = currentIndex;
    }else{
        if(index < playlist.length)
            currentIndex = index;
    }
    var file = playlist[index];
    console.log("playing: " + file);
	//if playing, stop current stream
	if (currentState == STATE.playing){
		stopH();
	}

	//if paused, resume last music
	if(currentState == STATE.paused){
		resumeH();
		return;
	}

	//set state to playing
	currentState = STATE.playing;
	//save last music path
	lastMusic = index;

	// manually write data to the decoder stream, which is a writeable stream
	//stream = fs.createReadStream(file).pipe(new lame.Decoder).pipe(new Speaker());
	stream = fs.createReadStream(file).pipe(new lame.Decoder);

	//pipe to speaker
	stream.pipe(new Speaker());


    stream.on('finish',function(){
        console.log("FINISH");
        next();
        playH(null);
    });

}

function pauseH(){
    if(currentState != STATE.paused) {
		stream.unpipe();
		currentState = STATE.paused;
	}
}

function resumeH(){
    if(currentState == STATE.paused){
		stream.pipe(new Speaker());
		currentState = STATE.playing;
	}
}

function stopH(){
	if(currentState != STATE.stopped){
		stream.unpipe();
		stream.end();
		stream = null;
		currentState = STATE.stopped;
	}
}

function next(){
    if(currentIndex < playlist.length-1)
        currentIndex ++;
    else
        currentIndex = 0;
}

function previous(){
    if(currentIndex > 0)
        currentIndex --;
}
