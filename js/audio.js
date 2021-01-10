

var musicVolume = 0.75;
var effectsVolume = 0.50;
var isMuted = false;
var firstGesture = false;
const VOLUME_INCREMENT = 0.25;


//define sounds
var backgroundSong = new soundLoopsClass("audio/childrenTrackV1.mp3");
var sfxGunTowerShoot = new soundSingleBufferClass("audio/gunTower.mp3");
var sfxElectroTowerShoot = new soundSingleBufferClass("audio/electroTower.mp3");
var sfxLaserTowerShoot = new soundSingleBufferClass("audio/laser.mp3");
var sfxMissleTowerShoot = new soundSingleBufferClass("audio/missileTower.mp3");
var sfxSlowdownTowerShoot = new soundSingleBufferClass("audio/slowdownTower.mp3");
var sfxFlameTowerShoot = new soundSingleBufferClass("audio/flameTower.mp3");

var sfxEnemyDead = new soundSingleBufferClass("audio/explosion.mp3");
var sfxGumStolen = new soundSingleBufferClass("audio/gumStolen.mp3");
var sfxHover = new soundSingleBufferClass("audio/hover.mp3");
//var invalidSelectSFX = new soundSingleBufferClass("audio/invalid_select_sfx.wav");


//audio UI -----------------------------------------------------------
function playBackgroundMusic(){
	if(siteActivatedWithClick && audioButton.toggledOn){
	//	backgroundSong.play();
	}
}

function audioButtonClass(){
	/* it should work now, check main.js,the audio button was instantiated before the canvas variable was defined therefore it was not accessible but it was accessible in the draw because it was called after canvas has been defined. (eddy casio101)*/
	this.x = this.width; //canvas.width doesn't work here for some reason??? (fixed)
	this.y = 32;
	this.hovered = false;
	this.toggledOn = true;

	this.draw = function(){
		if(this.toggledOn){
//			canvasContext.drawImage(soundOnPic, canvas.width-64, this.y);
		} else{
//			canvasContext.drawImage(soundOffPic, canvas.width-64, this.y);
		}
	}

	this.checkHover = function(){
		if(mousePosX > canvas.width && mousePosX < canvas.width && mousePosY > this.y && mousePosY < this.y){
			this.hovered = true;
		} else{
			this.hovered = false;
		}
	}

	this.toggle = function(){
		//backgroundSong.stop();
		if(this.toggledOn){
			this.toggledOn = false;
		} else{
			this.toggledOn = true;
		}
	}
}


//--//sound classes-----------------------------------------------------------
var backgroundMusic = function backgroundMusicClass() {

	var musicSound = null;
	var fadeTrack = null;
	var fileName;

	this.loopSong = function(fullFilenameWithPath) {
		if (fullFilenameWithPath == fileName) {
			return false;
		} else {
			fileName = fullFilenameWithPath;
		}

		var newTrack = new Audio(fileName);
		newTrack.oncanplaythrough = function() {
			if (musicSound != null && fadeTrack != null) {
				fadeTrack.pause();
				fadeTrack = musicSound;
				musicSound = null;
			} else if (musicSound != null) {
				fadeTrack = musicSound;
				musicSound = null;
			}
			musicSound = newTrack;
			musicSound.loop = true;
			this.setVolume(musicVolume);

			if (fadeTrack != null) {
				fadeTrack.ontimeupdate = function() {
					var newVolume = fadeTrack.volume - VOLUME_INCREMENT;

					if(newVolume > 1.0) {newVolume = 1.0;}

					if (newVolume < 0.015) {
						fadeTrack.pause();
						fadeTrack = null;
					} else {
						fadeTrack.volume = newVolume;
					}
				}
			}
		}
	}

	this.pause = function() {
		musicSound.pause();
		fadeTrack.pause();
		fadeTrack = null;
	}

	this.stop = function() {
		musicSound.pause();
		if (fadeTrack != null) {
			fadeTrack.pause();
			fadeTrack = null;
		}

		musicSound.currentTime = 0;
	}

	this.resume = function() {
		musicSound.play();
	}

	this.restart = function() {
		musicSound.pause();
		musicSound.currentTime = 0;
		musicSound.play();
	}

	this.setVolume = function(value) {
		if (musicSound == null) {return;}

		musicSound.volume = Math.pow(value * !isMuted, 2);

		if(musicSound.volume == 0) {
			musicSound.pause();
		} else if (musicSound.paused) {
			musicSound.play();
		}
	}
}

function soundLoopsClass(fullFilenameWithPath) {

	var fileName = fullFilenameWithPath;
	var sound = new Audio(fileName);
	sound.loop = true;
	this.play = function() {
		if (sound.paused) {
			sound.currentTime = 0;
			sound.volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
			sound.play();
		}
	}

	this.stop = function() {
		sound.pause();
	}

	this.setVolume = function(value) {
		if (sound == null) {return;}

		sound.volume = Math.pow(value * !isMuted, 2);

		if(sound.volume == 0) {
			sound.pause();
		} else if (sound.paused) {
			sound.play();
		}
	}
}

function soundSingleBufferClass(fullFilenameWithPath) {

	var fileName = fullFilenameWithPath;
	var sound = new Audio(fileName);
	
	this.play = function() {

		sound.currentTime = 0;
		sound.volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
		sound.play();
	}

	this.isPaused = function(){
		return sound.paused
	}

	this.stop = function() {
		sound.pause();
	}
}

function soundMultiBufferClass(fullFilenameWithPath, voices = 2) {

	var fileName = fullFilenameWithPath;
	var soundIndex = 0;
	var sounds = new Array(voices);
	for (var i = 0; i < sounds.length; i++) {
		sounds[i] = new Audio(fileName);
	}

	this.play = function() {

		sounds[soundIndex].currentTime = 0;
		sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
		sounds[soundIndex].play();
		soundIndex++;
		if(soundIndex >= sounds.length){
			soundIndex = 0;
		}
	}

	this.stop = function() {
		for (var i in sounds) {
			sounds[i].pause();
		}
	}
}

function soundDynamicBufferClass(fullFilenameWithPath) {

	var fileName = fullFilenameWithPath;
	var soundIndex = 0;
	var sounds = [new Audio(fileName)];

	this.play = function() {
		if(!sounds[soundIndex].paused) {
			sounds.splice(soundIndex, 0, new Audio(fileName));
		}

		sounds[soundIndex].currentTime = 0;
		sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
		sounds[soundIndex].play();

		soundIndex = (++soundIndex) % sounds.length;
	}

	this.stop = function() {
		for (var i in sounds) {
			sounds[i].pause();
		}

		sounds = [new Audio(fileName)];
		soundIndex = 0;
	}
}

function soundRandomClass(arrayOfFilenames) {
	var soundIndex = 0;
	var sounds = [''];

	for (var i = 0; i < arrayOfFilenames.length; i++) {
		sounds[i] = new Audio(arrayOfFilenames[i]);
		sounds[i+arrayOfFilenames.length] = new Audio(arrayOfFilenames[i]);
	}

	this.play = function() {
		soundIndex = rndInt(0, sounds.length - 1);
		if(!sounds[soundIndex].paused) {
			var startIndex = soundIndex;
			soundIndex++;
			while (!sounds[soundIndex].paused && startIndex != soundIndex) {
				if (soundIndex >= sounds.length) {
					soundIndex = 0;
				}
			}
		}

		sounds[soundIndex].currentTime = 0;
		sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
		sounds[soundIndex].play();
	}

	this.stop = function() {
		for (var i in sounds) {
			sounds[i].pause();
		}
	}
}

//--//sound functions---------------------------------------------------------
function getRandomVolume(){
	var min = 0.8;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function toggleMute() {
	isMuted = !isMuted;
	backgroundMusic.setVolume(musicVolume);
}

function setMusicVolume(amount) {
	musicVolume = amount;
	if(musicVolume > 1.0) {
		musicVolume = 1.0;
	} else if (musicVolume < 0.0) {
		musicVolume = 0.0;
	}
	backgroundSong.setVolume(musicVolume);
}

function turnMusicVolumeUp() {
	setMusicVolume(musicVolume + VOLUME_INCREMENT);
}

function turnMusicVolumeDown() {
	setMusicVolume(musicVolume - VOLUME_INCREMENT);
}

function setEffectsVolume(amount) {
	effectsVolume = amount;
	if(effectsVolume > 1.0) {
		effectsVolume = 1.0;
	} else if (effectsVolume < 0.0) {
		effectsVolume = 0.0;
	}
}

function turnEffectsVolumeUp() {
	setEffectsVolume(effectsVolume + VOLUME_INCREMENT);
}

function turnEffectsVolumeDown() {
	setEffectsVolume(effectsVolume - VOLUME_INCREMENT);
}

function setVolume(amount) {
	setMusicVolume(amount);
	setEffectsVolume(amount);
	backgroundSong.setVolume(amount);
}

function turnVolumeUp() {
	var effectsVolumeWas = effectsVolume;
	turnMusicVolumeUp();
	turnEffectsVolumeUp();
	return effectsVolumeWas != effectsVolume;// true if volume was able to change
}

function turnVolumeDown() {
	turnMusicVolumeDown();
	turnEffectsVolumeDown();
}

function gesture() {
	if (firstGesture) return;

	//On first click code, probably title music

	firstGesture = true;
}
