var express = require('express');
var router = express.Router();
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var Events = require('events');
var eventEmitter = new Events.EventEmitter();
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
    eventEmitter.emit('back', currentIndex);
}

exports.forward = function(){
    stopH();
    next();
    playH();
    eventEmitter.emit('next', currentIndex);
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

exports.eventEmitter = eventEmitter;

function playH(index){
    //if index is null, play from playlist. If both null, return
	if (index == null){ 
        index = currentIndex;
    }else{
        if(index < playlist.length)
            currentIndex = index;
    }

    //return if playlist is empty
    if(!playlist.length){
        return;
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
    eventEmitter.emit('play', currentIndex);
}

function pauseH(){
    if(currentState != STATE.paused) {
		stream.unpipe();
		currentState = STATE.paused;
        eventEmitter.emit('pause');
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
