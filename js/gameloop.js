const TILE_SIZE = 48;

var offsetX = 0;
var offsetY = 0;
var gameTimer = 0;

gameLoop = new function(){
	
	//All class vars get their value in this.resetGame() 
	//to avoid unwanted behavior during map changes
	this.mapName;
	this.rows;
	this.cols;

	this.map = [];
	this.pathList = [];
	this.mapTowerPos = [];
	this.mapStartPos = [];
	this.mapGoalPos = [];
	this.mapGumAltarPos = [];

	this.gums = [];
	this.currentWave;
	this.waveSubCounter;
	this.noMoreWaves;
	this.waveList = [];
	this.enemyList = [];
	this.towerList = [];
	this.towerMenu;

	this.coins = 2000;

	//id for coin animation
	this.id=null;

	//move things here
	this.move = function (){
		gameTimer++;
		this.moveMapWithMouse();
		this.constrainOffsetsToCanvas();

		let remainingGums = 0;
		for(let i = 0; i < this.gums.length; i++)
		{
			if(!this.gums[i].isDead)
			{
				this.gums[i].move();
				remainingGums++;
			}
		}

		if(remainingGums == 0)
		{
			console.log("Game Over, you lost all your gum!");
			// Insert code for lose screen call here
			return;
		}

		if(this.enemyList.length == 0 && this.noMoreWaves)
		{
			console.log("You won");
			//Insert code for win screen call here
			return;
		}

		this.processWave();

		for (let i = 0; i < this.towerList.length; i++)
		{
			this.towerList[i].move();
		}

		//Loop runs backwards to avoid skipping elements bug
		for (let i = this.enemyList.length - 1; i >= 0; i--)
		{
			if(this.enemyList[i].canBeRemoved)		
			{
				this.enemyList.splice(i, 1);
			}
			else
			{
				this.enemyList[i].move();
			}
		}

		if(this.towerMenu.isActive)
		{
			this.towerMenu.move();
		}

	}


	//draw things here
	this.draw = function(){
		
		//draw map
		drawImageWithAngle(this.mapName, offsetX, offsetY, 0);

		for(let i = 0; i < this.enemyList.length; i++)
		{
			this.enemyList[i].draw();
		}

		for(let i = 0; i < this.gums.length; i++)
		{
			this.gums[i].draw();			
		}

		for (let i = 0; i < this.towerList.length; i++)
		{
			this.towerList[i].draw();
		}

		colorRect(20,10, 130, 30, "white");

		//call the draw_anim_loop function
		animationSystem.draw_anim_loop(this.id, 5);
		
		colorText(this.coins, 25, 30, 20, "black");

		this.drawTowerPlaceableIndicator();

		if(this.towerMenu.isActive)
		{
			this.towerMenu.draw();
		}

	}

	this.towerPlaceableIndicatorRadius = 11;
	this.isTowerPlaceableIndicatorRadiusIncreasing = false;
	this.drawTowerPlaceableIndicator = function(color1 = '#00ff00', color2 = '#ff0000', animationFactor = 0.49)
	{
		let mouseIDX = returnIndexPosFromPixelPos(mouseX - offsetX);
		let mouseIDY = returnIndexPosFromPixelPos(mouseY - offsetY);

		// when world is scrolled around it is possible to 
		// click outside the map and get negative numbers or out of bounds
		if(this.map[this.pathList[0]][mouseIDX]==undefined) return;
		if(this.map[this.pathList[0]][mouseIDX][mouseIDY]==undefined) return;

		if(this.map[this.pathList[0]][mouseIDX][mouseIDY] == 4) 
		{
			var minRadius = 9, maxRadius = 17;

			this.isTowerPlaceableIndicatorRadiusIncreasing = this.towerPlaceableIndicatorRadius < maxRadius ? true : false;
			if (this.towerPlaceableIndicatorRadius > maxRadius) this.towerPlaceableIndicatorRadius = minRadius;

			this.towerPlaceableIndicatorRadius += (this.isTowerPlaceableIndicatorRadiusIncreasing ? 1 : -1) * animationFactor;
			
			var rectFactor = this.towerPlaceableIndicatorRadius * 1.4;
						
			rectBorderOnly(mouseX - rectFactor / 2, 
						   mouseY - rectFactor / 2, 
						   rectFactor, 
						   rectFactor, 
						   6, 
						   color2);
			colorCircle(mouseX, mouseY, this.towerPlaceableIndicatorRadius, color1);
			colorCircle(mouseX, mouseY, this.towerPlaceableIndicatorRadius * 0.3, color2);
		}
	}

	this.onMouseClicked = function()
	{

		let mouseIDX = returnIndexPosFromPixelPos(mouseX - offsetX);
		let mouseIDY = returnIndexPosFromPixelPos(mouseY - offsetY);

		if(this.towerMenu.isActive === true)
		{
			this.towerMenu.mouseClicked(mouseX - offsetX,mouseY - offsetY);
		}

		// when world is scrolled around it is possible to 
		// click outside the map and get negative numbers or out of bounds
		if(this.map[this.pathList[0]][mouseIDX]==undefined) return;
		if(this.map[this.pathList[0]][mouseIDX][mouseIDY]==undefined) return;

		if(this.map[this.pathList[0]][mouseIDX][mouseIDY] == 4 && !this.towerMenu.isActive)
		{
			this.towerMenu.openNewTowerMenu(mouseIDX, mouseIDY);
		}
		else if(this.map[this.pathList[0]][mouseIDX][mouseIDY] == 6)
		{
			for(let t = 0; t < this.towerList.length; t++)
			{
				if(this.towerList[t].indexX == mouseIDX && this.towerList[t].indexY == mouseIDY)
				{
					this.towerMenu.upgradeTowerMenu(t, mouseIDX, mouseIDY);
					return;
				}
			}
			
		}
		
	}

	this.moveMapWithMouse = function()
	{ 
		if(draggingMouse)
		{
			offsetX = dragMouseDX;
			offsetY = dragMouseDY;
		}
	}

	this.constrainOffsetsToCanvas =function(){
		let img = image.get(this.mapName);
		if (offsetX > 0) {
			offsetX = 0;
		}
		if (offsetX < canvas.width - img.width) {
			 offsetX = canvas.width - img.width;
		}
		if (offsetY > 0) {
			offsetY = 0;
		}
		if (offsetY < canvas.height - img.height) {
			offsetY = canvas.height - img.height;
		}
	}

	this.spawnTower = function(atIndexX, atIndexY, towerType)
	{
		let newTower
		switch (towerType) {
			case "gunTower":
				newTower = new GunTowerClass();
				break;
			case "slowdownTower":
				newTower = new SlowTowerClass();
				break;
			case "missleTower":
				newTower = new MissleTowerClass();
				break;
		}
		newTower.init(atIndexX, atIndexY);
		this.towerList.push(newTower);

		for(let i = 0; i < this.pathList.length; i++)
		{
			this.map[this.pathList[i]][atIndexX][atIndexY] = 6;	
		}
				
	}

	this.sellTower = function(towerIndex, price)
	{
		for(let i = 0; i < this.pathList.length; i++)
		{
			this.map[this.pathList[i]][this.towerList[towerIndex].indexX][this.towerList[towerIndex].indexY] = 4;	
		}		

		this.towerList.splice(towerIndex,1);
		this.coins += price;		
	}

	this.getPriceNewTower = function(type)
	{
		switch (type) {
			case "gunTower":
				return 50;
			case "slowdownTower":
				return 100;
			case "missleTower":
				return 150;
		}			
	}

	this.addCoins = function(amount)
	{
		this.coins += amount;			
	}

	this.removeCoins = function(amount)
	{
		this.coins -= amount;			
	}

	this.spawnEnemy = function(pathNumber, enemyType)
	{
		let newEnemy = new EnemyClass();
		newEnemy.init(pathNumber, enemyType);
		this.enemyList.push(newEnemy);			
	}

	this.returnGumAltarPos = function(pathNumber)
	{
		//returns .indexX and .indexY
		return this.mapGumAltarPos[pathNumber];
	}

	this.returnStartPos = function(pathNumber)
	{
		//returns .indexX and .indexY
		return this.mapStartPos[pathNumber];
	}

	this.returnGoalPos = function(pathNumber)
	{
		//returns .indexX and .indexY
		return this.mapGoalPos[pathNumber];
	}

	this.returnMapOfPath = function(pathNumber)
	{
		return this.map[pathNumber];
	}

	this.returnGumListFromAnAltar = function(fromAltar)
	{
		let cacheGums = [];
		for(let i = 0; i < this.gums.length; i++)
		{
			if(this.gums[i].fromAltar == fromAltar)
			{
				cacheGums.push(i);
			}
		}
		return cacheGums;
	}

	this.processWave = function()
	{
		if(!this.noMoreWaves)
		{

			if(this.waveList[this.currentWave].timerCache <= 0)
			{
				if(this.waveList[this.currentWave][this.waveSubCounter].amountToSpawn > 0)
				{
					this.spawnEnemy(this.waveList[this.currentWave][this.waveSubCounter].spawnOnPath, this.waveList[this.currentWave][this.waveSubCounter].enemyType);
					this.waveList[this.currentWave][this.waveSubCounter].amountToSpawn--;
					this.waveList[this.currentWave].timerCache = this.waveList[this.currentWave][this.waveSubCounter].delayBetweenSpawn * 60;
				}

				if(this.waveList[this.currentWave][this.waveSubCounter].amountToSpawn == 0)
				{
					this.waveSubCounter++;

					if(this.waveSubCounter == this.waveList[this.currentWave].length)
					{
						this.currentWave++;
						this.waveSubCounter = 0;

						if(this.currentWave == this.waveList.length)
						{
							this.noMoreWaves = true;
							this.currentWave--; //avoiding undefined error
							console.log("Last enemy!");
							return;
						}
					}			
				}
			}
			else
			{
				this.waveList[this.currentWave].timerCache--;
			}	
			
		}

	}

	//Inititalize
	this.init = function(levelName)
	{
		
		this.resetGame();

		//Registers the id.
		this.id=animationSystem.register("UI_Coin",4,{X:50,Y:50});
		for (let i = 0; i < levelList.length; i++)
		{
			if(levelName == levelList[i].levelName)
			{
				
				
				
				this.generateWaveVarsFromlevelList(levelList[i]);
				this.mapName = levelList[i].mapName;
				break;
			}
		}

		for (let i = 0; i < mapList.length; i++)
		{
			if(this.mapName == mapList[i].name)
			{
				this.generateMapVarsFromEditorMapList(mapList[i]);
				break;
			}
		}

		let gumAmount = 5
		for(let i = 0; i < this.pathList.length; i++)
		{
			for(let gi = 0; gi < gumAmount; gi++)
			{
					let newGum = new GumClass();
					newGum.init(this.pathList[i]);
					this.gums.push(newGum);
			}
		}

	}

	this.resetGame = function()
	{
		gameTimer = 0;
		this.mapName;
		this.rows;
		this.cols;

		this.map = [];
		this.pathList = [];
		this.mapTowerPos = [];
		this.mapStartPos = [];
		this.mapGoalPos = [];
		this.mapGumAltarPos = [];

		this.gums = [];
		this.currentWave = 0;
		this.waveSubCounter = 0;
		this.noMoreWaves = false;
		this.waveList = [];
		this.enemyList = [];
		this.towerList = [];

		this.towerMenu = new TowerMenuClass();
		animationSystem.resetList()
	}

	this.generateWaveVarsFromlevelList = function(level)
	{
		let waveList = copyArray(level);

		for (let i = 0; i < waveList.wave.length; i++)
		{
			waveList.wave[i].timerCache = waveList.waveStartDelay[i] * 60;
		}
		this.currentWave = 0;
		this.waveList = waveList.wave;
	}

	this.generateMapVarsFromEditorMapList = function(mapToProcess)
	{	
		//map Legend:
		// 0 = empty
		// 1 = Enemy Start spawn point
		// 2 = Enemy path way
		// 3 = Enemy Goal
		// 4 = player turret spawn Point
		// 5 = Gum Altar

		this.rows = mapToProcess.rows;
		this.cols = mapToProcess.cols;
		this.map = copyArray(mapToProcess.map);

		for(let i = 0; i < mapToProcess.map.length; i++)
		{
			if(mapToProcess.map[i] !== false)
			{
				for(let x =  0; x < mapToProcess.rows; x++)
				{
					for(let y = 0; y < mapToProcess.cols; y++)
					{
						switch (mapToProcess.map[i][x][y]) {
							case 0:
								break;
							case 1:
								this.mapStartPos[i] = {indexX: x, indexY: y};
								break;
							case 2:
								if(!this.pathList.includes(i)) this.pathList.push(i);								
								break;
							case 3:
								this.mapGoalPos[i] = {indexX: x, indexY: y};
								break;
							case 4:
								this.mapTowerPos.push({indexX: x, indexY: y});
								break;
							case 5:
								this.mapGumAltarPos[i] = {indexX: x, indexY: y};
								break;
						}
					}
				}
			}else{
				this.mapStartPos[i] = false;
				this.mapGoalPos[i] = false;
				this.mapGumAltarPos[i] = false;
			}
		}

		for(let i = 0; i < this.pathList.length; i++)
		{
			for(let t = 0; t < this.mapTowerPos.length; t++)
			{
				this.map[this.pathList[i]][this.mapTowerPos[t].indexX][this.mapTowerPos[t].indexY] = 4;
			} 		
		}

	}

}
