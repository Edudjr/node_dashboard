var Song = function(fullName, filePath){
	this.fullName = fullName;
	this.filePath = filePath;
	this.artist = null;
	this.song = null;
	this.getMetaData();
}

Song.prototype.getMetaData = function(){
	var song = null;
	var artist = null;
    var artistMatch = this.fullName.match(/.*-/i);
   
    if(artistMatch!=null){
    	artist = artistMatch[0];
    	song = this.fullName.replace(artist, "");
    	artist = artist.slice(0, -1);
    }else{
    	artist = 'N/A';
    	song = this.fullName;
    }
    this.artist = artist.trim();
    this.song = song.trim(); 
}

module.exports = Song;