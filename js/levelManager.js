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

    this.init = function()
    {
        for(let i = 0; i < levelList.length; i++)
        {
            this.highScores.push(0);
        }
    }

});