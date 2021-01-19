function getHighscore(level=0) {
	var score = 0;
	if (window.localStorage) { // might be disabled
		score = localStorage.getItem('highscore_'+level);
		if (!score) score = 0; // might be undefined
	}
	console.log("Current high score for level " + level + " is " + score);
	return score;
}

function setHighscore(level=0,score=0) {
	if (window.localStorage) {
		localStorage.setItem('highscore_'+level,score);
		console.log("New high score for level " + level + " is " + score);
	}
}