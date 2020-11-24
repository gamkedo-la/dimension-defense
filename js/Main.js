var canvas;
var ctx;
var scene = 'game';

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("Loading Game...", canvas.width/2, canvas.height/2, 'white');
	
	if(image.loadImages()){
		gameLoop.init('lvlPencil');
		StartGame();
	}
}

function StartGame() {
	var framesPerSecond = 60;
	setInterval(updateAll, 1000/framesPerSecond);
	setupInput();
}

function updateAll() {
	colorRect(0,0, canvas.width,canvas.height, 'white');

	switch (scene) {
		case 'game':
			gameLoop.move();
			gameLoop.draw();
			break;
	}
	
}
