var canvas, ctx;
var scene = 'mainMenu';
var offsetX = 0;
var offsetY = 0;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("Loading...", canvas.width/2, canvas.height/2, 'white');
	
	if(image.loadImages()){
		mainMenu.init();
		StartGame();
	}
}

function StartGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
	setupInput();
}

function updateAll() {
	colorRect(0,0, canvas.width,canvas.height, 'white');
	switch (scene) {
		case 'mainMenu':
			mainMenu.draw();
			break;
		case 'levelEditor':
			levelEditor.move();
			levelEditor.draw();
			break;
	}
	
}
