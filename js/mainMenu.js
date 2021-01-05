const MainMenu = new (function () {

    let itemsX = 240;
    let topItemY = 200;
    let itemsWidth = 300;
    let itemsHeight = 60;
    let rowHeight = 80;
    let textSizePassive = 45;
    let textSizeActive = 50;
    
    let muzzleFlashAlpha = 0;
    let tower =
    {
        x: 80,
        y: 80,
        angle: 0,
        shoot: {},
    }
    let isShooting = false;
    let selectedItemOnPage;
    let mainMenuList =
    [
        "Play Game",
        "Volume",
        "Credits",
    ];

    let mapPreviewMaXRows = 3;
    let mapPrevievthumbWidth = 200;
    let mapPrevievRowDist = 30;
    let mapPrevievColDist = 10;
    let mapPreviewHoverItem;
    let isHoveringMapItem = false;

    let currentMenu = "main";

    this.move = function () {
        backgroundSong.stop()
        switch (currentMenu) {
            case "main":
                this.moveMainMenu();
                break;
            case "playGame":
                this.movePlayGame();
                break;
        }

    }
    
    this.showHighScore = function () {
        let maxScoresToShow = 5;
	    if (LevelManager.highScores.length < maxScoresToShow) {
            maxScoresToShow = LevelManager.highScores.length;
        }
        for (let i=0; i<maxScoresToShow; i++){
            colorText("HighScore" +  (i+1) + LevelManager.highScores[i], 10, 80+i*30, 22, "white");
        }
    }

    this.draw = function () 
    {
        colorRect(0, 0, canvas.width, canvas.height, '#3d3d3d');

        switch (currentMenu) {
            case "main":
                this.drawMainMenu();
                this.showHighScore();
                break;
            case "playGame":
                this.drawPlayGame();
                break;
            case "credits":
                this.drawCredits();
                break;
        }
    }

    this.moveMainMenu = function () {
        this.checkMouseHoverMainMenu();

        tower.angle = getAngleBetween2PointsInRadian(tower.x, tower.y, mouseX, mouseY);
        if(isShooting === true)
        {   
            let r = 10;
            tower.shoot.x += Math.cos(tower.shoot.angle) * tower.shoot.speed;
            tower.shoot.y += Math.sin(tower.shoot.angle) * tower.shoot.speed;

            if (
            tower.shoot.x > tower.shoot.goalX - r && tower.shoot.x < tower.shoot.goalX + r &&
            tower.shoot.y > tower.shoot.goalY - r &&
            tower.shoot.y < tower.shoot.goalY + r)
            {
                this.mainMenuSelect(tower.shoot.menu)
            }
        }
    }

    this.drawMainMenu = function () {
        for (let i = 0; i < mainMenuList.length; i++) {
            if (selectedItemOnPage === mainMenuList[i].toString()) {
                colorRectWithAlpha(itemsX, topItemY + (rowHeight * i), itemsWidth, itemsHeight, '#7158e2', 0.85);
                colorTextBold(
                    mainMenuList[i],
                    itemsX + 10,
                    topItemY + (rowHeight * i) + 40,
                    textSizeActive,
                    "#00ffAA"
                );
            }else{
                colorRectWithAlpha(itemsX, topItemY + (rowHeight * i), itemsWidth, itemsHeight, '#17c0eb', 0.85);
                colorTextBold(
                    mainMenuList[i],
                    itemsX + 10,
                    topItemY + (rowHeight * i) + 40,
                    textSizePassive,
                    "white"
                );
            }

            if (mainMenuList[i] == 'Volume') {
                colorTextBold(
                    Math.floor(effectsVolume * 100) + "%",
                    itemsX + itemsWidth + 10,
                    topItemY + rowHeight * i + 40,
                    textSizePassive,
                    "white"
                );
            }
        }

        drawBitmapCenteredWithRotationAndScale("MissileTowerBaseL1", tower.x, tower.y, 0, 1.5);
        drawBitmapCenteredWithRotationAndScale("MissileTowerTurretL1", tower.x, tower.y, tower.angle, 1.5);
     

        if(isShooting === true)
        {
            let angleWobble = degreesToRadian(Math.floor(Math.random() * Math.floor(10)));
            drawBitmapCenteredWithRotationAndScale("MissileL1", tower.shoot.x, tower.shoot.y, tower.shoot.angle + angleWobble, 1.5);

            if (muzzleFlashAlpha > 0) {
                ctx.globalAlpha = muzzleFlashAlpha;
                muzzleFlashAlpha -= 0.025; // fade out
                drawBitmapCenteredWithRotationAndScale("MuzzleFlash", tower.x, tower.y , tower.angle, 3);
                ctx.globalAlpha = 1;		
		    }           
        }

    }
    
    this.movePlayGame = function()
    {
        let mapListRow = 0;
        let mapListCol = 0;
        
        for(let i = 0; i < mapList.length; i++){

            if(i != 0 && i % mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}

            if(mouseX > mapPrevievRowDist + (mapPrevievthumbWidth + mapPrevievRowDist) * mapListRow && 
                mouseX < mapPrevievRowDist + (mapPrevievthumbWidth + mapPrevievRowDist) * mapListRow + mapPrevievthumbWidth &&
                mouseY > mapPrevievColDist + (mapPrevievthumbWidth + mapPrevievColDist) * mapListCol &&
                mouseY < mapPrevievColDist + (mapPrevievthumbWidth + mapPrevievColDist) * mapListCol + mapPrevievthumbWidth){
                
                isHoveringMapItem = true;
                mapPreviewHoverItem = i;
                return;				
            }
            mapListRow++;
        }

        isHoveringMapItem = false;
    }

    this.drawPlayGame = function()
    {
        let mapListRow = 0;
        let mapListCol = 0;

        this.BackButtonToMainMenu();
        colorText("Debug:press L to unlock all levels", 200, 18, 18, "red")
        for(let i = 0; i < levelList.length; i++){
            let drawbig = false;
            if(isHoveringMapItem && i === mapPreviewHoverItem){drawbig = true;}
            if(i != 0 && i % mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}
            drawImageScaledToWidthSize(levelList[i].mapName, mapPrevievRowDist + (mapPrevievthumbWidth + mapPrevievRowDist) * mapListRow,
                                30 + mapPrevievColDist + (mapPrevievthumbWidth + mapPrevievColDist) * mapListCol, mapPrevievthumbWidth + (drawbig * 20));
            
            if(i > LevelManager.unlockedLevels)
            {
                let si = mapPrevievthumbWidth + (drawbig * 20);
                colorRectWithAlpha(mapPrevievRowDist + (mapPrevievthumbWidth + mapPrevievRowDist) * mapListRow,
                30 + mapPrevievColDist + (mapPrevievthumbWidth + mapPrevievColDist) * mapListCol, si, 
                (si / image.get(levelList[i].mapName).width) * image.get(levelList[i].mapName).height , "#111111", "0.6");
            }
            colorText("HighScore: " + LevelManager.highScores[i], mapPrevievRowDist + (mapPrevievthumbWidth + mapPrevievRowDist) * mapListRow,
                        30 + mapPrevievColDist + (mapPrevievthumbWidth + mapPrevievColDist) * mapListCol - 5, 20, 'white');
            mapListRow++;
        }

    }

    this.drawCredits = function()
    {
        this.BackButtonToMainMenu();
        colorText("Your name here", 150 , 100, 50, 'white');
        colorText("for the low low price", 150 , 200, 50, 'white');
        colorText("of just 1 commit!", 150 , 300, 50, 'white');
    }

    this.mouseClicked = function () {

        switch (currentMenu) {
            case "main":
                this.mouseClickedMainMenu();
                break;
            case "playGame":
                this.mouseClickedPlayMenu();
                break;
            case "credits":
                this.mouseClickedCreditsScreen();
                break;       
        }

    }

    this.mouseClickedMainMenu = function()
    {
        if(isShooting === false)
        {
            if(selectedItemOnPage !== "nothing")
            {
                this.shoot(mouseX, mouseY);
                isShooting = true;
            }
        }
    }

    this.mouseClickedPlayMenu = function()
    {
        if(this.BackButtonToMainMenu())
        {
            currentMenu = "main"
        }
        if(isHoveringMapItem === true && mapPreviewHoverItem <= LevelManager.unlockedLevels)
        {    
            gameLoop.init(levelList[mapPreviewHoverItem].levelName);
            currentMenu = "main";
            scene = "game";
        }
    }

    this.mouseClickedCreditsScreen = function()
    {
        if(this.BackButtonToMainMenu())
        {
            currentMenu = "main"
        }
    }

    this.BackButtonToMainMenu = function()
    {
        let x = 20;
        let y = 520;
        let h = 50;
        let w = 200;
        if (mouseX > x && mouseX < x + w &&
            mouseY > y && mouseY < y + h)
        {
            colorRectWithAlpha(x, y, w, h, '#7158e2', 0.85);
            colorTextBold("Back", x + 10, y + h/1.5, 50, "#00ffAA" );
           
            return true;
        }else{     
            colorRectWithAlpha(x, y, w, h, '#17c0eb', 0.85);
            colorTextBold("Back", x + 10, y + h/1.5, 45, "white" );
            return false;
        } 

    }


    this.mainMenuSelect = function(menu)
    {
        for (let i = 0; i < mainMenuList.length; i++) {
            if (menu === mainMenuList[i].toString()) {
                switch (menu) {
                    case "Play Game":
                        currentMenu = "playGame";
                        break;
                    case 'Volume':
                        if (turnVolumeUp() == false) {
                            setVolume(0);
                        }
                        break;
                    case "Credits":
                        currentMenu = "credits";
                        break;  
                    default:
                        console.log("unhandeled menu item");
                        break;
                }
                isShooting = false;
            }
        }
    }

    this.checkMouseHoverMainMenu = function () {
        for (let i = 0; i < mainMenuList.length; i++) {
            if (
            mouseX > itemsX && mouseX < itemsX + itemsWidth &&
            mouseY > topItemY + (i * rowHeight) &&
            mouseY < topItemY + (i* rowHeight) + itemsHeight)
            {
                selectedItemOnPage = mainMenuList[i];
                return;
            }
        }
        //else
        selectedItemOnPage = "nothing";
    }

    this.shoot = function(goalX,goalY)
	{
		let dX = Math.cos(tower.angle);
		let dY = Math.sin(tower.angle);
		tower.shoot = {
			x: tower.x + dX * 40,
			y: tower.y + dY * 40,
			angle: tower.angle,
			speed: 8,
            goalX: goalX,
            goalY: goalY,
            menu: selectedItemOnPage
		};
        muzzleFlashAlpha = 1;
	}

});