const LevelManager = new (function () {

    this.unlockedLevels = 0;

    this.unlockNextLevel = function(currentLevelName)
    {
        for(let i = 0; i < levelList.length; i++)
        {
            if(levelList[i].levelName == currentLevelName)
            {
                if(i == this.unlockedLevels)
                {
                    this.unlockedLevels++;
                }
                return;
            }
        }
    }

});