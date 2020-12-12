function GameOverScreen () {
    this.draw = function(isGameOver, hasWon) {
        this.gameOverBoxColor = hasWon ? "green" : "red";
        this.gameOverText = hasWon ? "YOU WON" : "YOU LOST";
        this.gameOverNextText = hasWon ? "CLICK TO RESTART" : "CLICK TO TRY AGAIN"

        if (isGameOver){
            let gameOverBoxWidth = 400; 
            let gameOverBoxHeight = 300;
            colorRectWithAlpha( 
                canvas.width/2 - gameOverBoxWidth/2, 
                canvas.height/2 - gameOverBoxHeight/2, 
                gameOverBoxWidth, 
                gameOverBoxHeight, 
                this.gameOverBoxColor, 
                0.7
            );
            let textAlignWas = ctx.textAlign;
            ctx.textAlign = "center";
            colorText(this.gameOverText, canvas.width/2, canvas.height/2, 50, "black");
            colorText(this.gameOverNextText, canvas.width/2, canvas.height/2 + 80, 20, "black");
            ctx.textAlign = textAlignWas;
        }
    }
}