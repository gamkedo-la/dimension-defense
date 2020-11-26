const TILE_SIZE = 48;

var offsetX = 0;
var offsetY = 0;
var gameTimer = 0;

var towerSelector = 1;
var playerCoins = 0;

gameLoop = new function(){
	
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
	this.waveList = [];
	this.enemyList = [];
	this.towerList = [];

	//move things here
	this.move = function (){
		gameTimer++;
		this.moveMapWithMouse();

		if(this.currentWave < this.waveList.length)
		{
			this.processWave();
		}
		else
		{
			if (!this.noMoreWaves) {
				console.log("no more waves! FIXME: load next level");
				this.noMoreWaves = true; // only tell us once
				// FIXME: level complete! go to next level
			}
		}

		for (let i = 0; i < this.towerList.length; i++)
		{
			this.towerList[i].move();
		}

		for (let i = this.enemyList.length - 1; i >= 0; i--)
		{
			if(this.enemyList[i].canBeRemoved)		
			{
				this.enemyList.splice(i, 1);
			}
			else if (this.enemyList[i].isDead)
			{
				this.enemyList[i].isDeadMove();
			}
			else
			{
				this.enemyList[i].move();
			}
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
			drawImageWithAngle("gum1", this.gums[i].x + offsetX, this.gums[i].y + offsetY, 0);
		}

		for (let i = 0; i < this.towerList.length; i++)
		{
			this.towerList[i].draw();
		}

		

	}

	this.onMouseClicked = function()
	{
		let mouseIDX = returnIndexPosFromPixelPos(mouseX - offsetX);
		let mouseIDY = returnIndexPosFromPixelPos(mouseY - offsetY);

		// when world is scrolled around it is possible to 
		// click outside the map and get negative numbers or out of bounds
		if(this.map[this.pathList[0]][mouseIDX]==undefined) return;
		if(this.map[this.pathList[0]][mouseIDX][mouseIDY]==undefined) return;

		
		if(this.map[this.pathList[0]][mouseIDX][mouseIDY] == 4 || 
			this.map[this.pathList[0]][mouseIDX][mouseIDY] == 6)
		{
			for(let t = 0; t < this.towerList.length; t++)
			{
				if(this.towerList[t].indexX == mouseIDX && this.towerList[t].indexY == mouseIDY)
				{
					console.log("A tower is already here.");
					this.incrementTower(t, mouseIDX, mouseIDY);
					return;
				}
			}
			this.spawnTower(mouseIDX, mouseIDY);
		}
		
	}

	this.moveMapWithMouse = function()
	{
        if (draggingMouse) {
            offsetX = dragMouseDX;
    	    offsetY = dragMouseDY;
		}
		
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

	this.spawnTower = function(atIndexX, atIndexY)
	{
		let newTower
		switch (towerSelector) {
			case 0:
				newTower = new GunTowerClass();
				break;
			case 1:
				newTower = new SlowTowerClass();
				break;
		}
		newTower.init(atIndexX, atIndexY);
		this.towerList.push(newTower);

		for(let i = 0; i < this.pathList.length; i++)
		{
			this.map[this.pathList[i]][atIndexX][atIndexY] = 6;	
		}
				
	}

	this.incrementTower = function(towerIndex, atIndexX, atIndexY)
	{
		switch(towerSelector) {
			case 0:
				towerSelector = 1;
				break;
			case 1:
				towerSelector = 0;
			break;
		}

		this.towerList.splice(towerIndex, 1);
		this.spawnTower(atIndexX, atIndexY);
	}

	this.spawnEnemy = function(pathNumber, enemyType)
	{
		let newEnemy = new EnemyClass();
		newEnemy.init(pathNumber, enemyType);
		this.enemyList.push(newEnemy);			
	}

	this.returnGumAltarPos = function(pathNumber)
	{
		return this.mapGumAltarPos[pathNumber];
	}

	this.returnStartPos = function(pathNumber)
	{
		return this.mapStartPos[pathNumber];
	}

	this.returnGoalPos = function(pathNumber)
	{
		return this.mapGoalPos[pathNumber];
	}

	this.returnMapOfPath = function(pathNumber)
	{
		return this.map[pathNumber];
	}

	this.returnGumListIndex = function(fromAltar)
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
		if(this.waveList[this.currentWave].timerCache <= 0)
		{
			this.spawnEnemy(this.waveList[this.currentWave][this.waveSubCounter].spawnOnPath, this.waveList[this.currentWave][this.waveSubCounter].enemyType);
			this.waveList[this.currentWave][this.waveSubCounter].amountToSpawn--;

			if(this.waveList[this.currentWave][this.waveSubCounter].amountToSpawn <= 0)
			{
				this.waveSubCounter++;
			}

			if(this.waveSubCounter == this.waveList[this.currentWave].length)
			{
				this.currentWave++;
				this.waveSubCounter = 0;					
			}
			else
			{
				this.waveList[this.currentWave].timerCache = this.waveList[this.currentWave][this.waveSubCounter].delayBetweenSpawn * 60;
			}
		}
		else
		{
			this.waveList[this.currentWave].timerCache--;
		}	
	}

	//Inititalize
	this.init = function(levelName)
	{
		this.resetGame();

		for (let i = 0; i < levelList.length; i++)
		{
			if(levelName == levelList[i].levelName)
			{
				this.generateWaveVarsFromLevelList(levelList[i]);
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

		for(let i = 0; i < this.pathList.length; i++)
		{
			for(let gi = 0; gi < 50; gi++)
			{
				this.gums.push(
					{
						x: returnPixelPosFromIndexPos(this.mapGumAltarPos[this.pathList[i]].indexX) + TILE_SIZE / 2, 
						y: returnPixelPosFromIndexPos(this.mapGumAltarPos[this.pathList[i]].indexY) + TILE_SIZE / 2,
						r: 20,
						fromAltar: this.pathList[i],
						hasOwner: false,
						dead: false
					}
				)
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
		this.waveList = [];
		this.enemyList = [];
		this.towerList = [];
	}

	this.generateWaveVarsFromLevelList = function(level)
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
