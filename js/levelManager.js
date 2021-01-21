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
                setUnlockedLevels(this.unlockedLevels);
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
                    setHighscore(i,score); // save to localstorage
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
            ["Ohno, the Dimensions", "got scrambeld up...","Creatures are trying to steal","your gum now!" ,"","Protect the gum from enemies", "by  placing down towers!!"],
            ["You can shape the path of ", "the creatures by placing down", "the towers strategically.", "", "Give it a try!"],
            ["This dimension looks bigger", "than the other ones...", "", "Drag the map around by", "holding down somewhere", "on the map!"],
            ["The path is splitting in", "this Dimension...", "", "Choose your tower placement", "very carefully!"],
        ]
        let popupBoxWidth = 500; 
        let popupBoxHeight = 350;
        colorRectWithAlpha( 
            150, 
            100, 
            popupBoxWidth, 
            popupBoxHeight, 
            "#139c9e", 
            0.8
        );

        for(let i = 0; i < story[this.unlockedLevels].length; i++)
        {
            colorText(story[this.unlockedLevels][i], 300, 160 + i * 30, 25, "#fafafa");
        }
        colorText("Click anywhere to Play!", 230, 430, 30, "#a8fa11");
    }

    this.init = function()
    {
        this.unlockedLevels = getUnlockedLevels();

        for(let i = 0; i < levelList.length; i++)
        {
            //setHighscore(i,Math.round(Math.random()*1000)); // bogus data for testing!
            this.highScores.push(getHighscore(i)); // localstorage
        }
    }

});