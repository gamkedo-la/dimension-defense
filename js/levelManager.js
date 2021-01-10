const LevelManager = new (function () {

    this.unlockedLevels = 0;
    this.highScores = [];

    this.unlockNextLevel = function(currentLevelName)
    {
        for(let i = 0; i < levelList.length; i++)
        {
            if(levelList[i].levelName == currentLevelName && i == this.unlockedLevels)
            {
                this.unlockedLevels++;
                return;
            }
        }
    }

    this.checkForNewHighScoreAndUpdate = function(levelName, score)
    {
        for(let i = 0; i < levelList.length; i++)
        {
            if(levelList[i].levelName == levelName)
            {
                if(score > this.highScores[i])
                {
                    this.highScores[i] = score;
                    return true;
                }else{
                    return false;
                }
            }
        } 
    }

    this.checkForGameStoryAndLoadGame = function(levelName)
    {
        for(let i = 0; i < levelList.length; i++)
        {
            if(levelList[i].levelName == levelName)
            {
                if(this.unlockedLevels == i)
                {
                    scene = "gameStory";
                    break;
                }else{
                    scene = "game";
                    break;
                }
            }
        }   
    }

    this.gameStoryPopupDraw = function(){
        let story =[
            "Hello",
            "hello2",
            "hello3",
        ]
        let popupBoxWidth = 500; 
        let popupBoxHeight = 350;
        colorRectWithAlpha( 
            150, 
            100, 
            popupBoxWidth, 
            popupBoxHeight, 
            "grey", 
            0.7
        );
        colorText(story[this.unlockedLevels], canvas.width/2, canvas.height/2, 50, "black");
        colorText("Click anywhere to Play!", 200, 450, 30, "red");
    }

    this.init = function()
    {
        for(let i = 0; i < levelList.length; i++)
        {
            this.highScores.push(0);
        }
    }

});