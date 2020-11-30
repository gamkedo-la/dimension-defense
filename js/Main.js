var canvas;
var ctx;
var scene = 'game';
gameIsPaused = false;

var offsetX = 0;
var offsetY = 0;
var animationSystem;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("Loading Game...", canvas.width/2, canvas.height/2, 'white');
	
	if(image.loadImages()){
		animationSystem=new animate();
		animationSystem.init();
		gameLoop.init('lvlPencil');
		StartGame();
	}
}

function StartGame() {
	var framesPerSecond = 60;
	setInterval(updateAll, 1000/60);
	setupInput();
	
}

function StopGame() {
	if (!gameIsPaused) {
			gameIsPaused = true;
			this.scene = 'pMenu';
	} else if (gameIsPaused) {
			gameIsPaused = false;
			this.scene = 'game';
	}
}

function updateAll() {
	colorRect(0,0, canvas.width,canvas.height, 'white');
	
	switch (scene) {
		case 'game':
			gameLoop.move();
			gameLoop.draw();
			animationSystem.update();
			break;

		case 'pMenu':
			gameLoop.draw();
			animationSystem.update();
			pausMenu.draw();
			pausMenu.update();
			break;

	}
}
