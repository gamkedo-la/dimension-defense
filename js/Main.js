var canvas;
var ctx;
var scene = 'mainMenu';
gameIsPaused = false;
pauseMenu = false;

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
		LevelManager.init();
		StartGame();
	}
}

function StartGame() {
	setInterval(updateAll, 1000/60);
	setupInput();
	
}

function StopGame() {
	if (!gameIsPaused) {
			gameIsPaused = true;
			this.scene = 'pauseMenu';
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
		case 'mainMenu':
            MainMenu.move();
			MainMenu.draw();
			break;
		case 'pauseMenu':
			gameLoop.draw();
			PauseMenu.draw();
			PauseMenu.update();
			break;

	}
}
