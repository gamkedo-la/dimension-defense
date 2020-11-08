const TILE_SIZE = 48;

var offsetX = 0;
var offsetY = 0;
var gameTimer = 0;

gameLoop = new function(){
	
	this.mapName;
	this.rows;
	this.cols;

	this.map = [];
	this.pathList = [];
	this.mapTurretPos = [];
	this.mapStartPos = [];
	this.mapGoalPos = [];
	this.mapGumAltarPos = [];

	this.gums = [];
	this.waveList = [];
	this.enemyList = [];
	this.turretList = [];

	//move things here
	this.move = function (){
		gameTimer++;
		//Just a place holder until wave system is done
		for(let i = 0; i < this.mapStartPos.length; i++)
		{
			if(gameTimer % 150 == 0 && this.mapStartPos[i] != false)
			{
				this.spawnEnemy(this.mapStartPos[i].indexX, this.mapStartPos[i].indexY, i);
				this.test++;		
			}
		}


		for (let i = this.enemyList.length - 1; i >= 0; i--)
		{
			if (this.enemyList[i].isDead)
			{
				this.enemyList.splice(i, 1);
			}
			else
			{
				this.enemyList[i].move();
			}
		}

		for (let i = 0; i < this.turretList.length; i++)
		{
			this.turretList[i].move();
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
			drawImageWithAngle("gum1", this.gums[i].x, this.gums[i].y, 0);
		}

		for (let i = 0; i < this.turretList.length; i++)
		{
			this.turretList[i].draw();
		}

	}

	this.onMouseClicked = function()
	{
		let mouseIDX = returnIndexPosFromPixelPos(mouseX, 'x');
		let mouseIDY = returnIndexPosFromPixelPos(mouseY, 'y');

		if(this.map[this.pathList[0]][mouseIDX][mouseIDY] == 4)
		{
			for(let t = 0; t < this.turretList.length; t++)
			{
				if(this.turretList[t].indexX == mouseIDX && this.turretList[t].indexY == mouseIDY)
				{
					console.log("A turret is already here.");
					return;
				}
			}

			this.spawnTurret(mouseIDX, mouseIDY);

		}
		

	}

	this.spawnTurret = function(atIndexX, atIndexY)
	{
		let newTurret = new BasicTuretClass();
		newTurret.init(atIndexX, atIndexY);
		this.turretList.push(newTurret);
				
	}

	this.spawnEnemy = function(atIndexX, atIndexY, pathNumber)
	{
		let newEnemy = new EnemyClass();
		newEnemy.init(atIndexX, atIndexY, pathNumber);
		this.enemyList.push(newEnemy);
				
	}

	this.returnGumAltarPos = function(pathNumber)
	{
		return this.mapGumAltarPos[pathNumber];
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

	//Inititalize
	this.init = function(levelName)
	{
		this.resetGame();

		for (let i = 0; i < levelList.length; i++)
		{
			if(levelName == levelList[i].levelName)
			{
				this.generateWaveVarsFromLevelList(levelList[i].wave);
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
						x: returnPixelPosFromIndexPos(this.mapGumAltarPos[this.pathList[i]].indexX, 'x') + TILE_SIZE / 2, 
						y: returnPixelPosFromIndexPos(this.mapGumAltarPos[this.pathList[i]].indexY, 'y') + TILE_SIZE / 2,
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

		this.map = [];
		this.pathList = [];
		this.mapTurretPos = [];
		this.mapStartPos = [];
		this.mapGoalPos = [];
		this.mapGumAltarPos = [];
		
		this.gums = [];
		this.waveList = [];
		this.enemyList = [];
	}

	this.generateWaveVarsFromLevelList = function(waveListToProcess)
	{
		for (let i = 0; i < waveListToProcess.length; i++)
		{
			waveListToProcess[i].delayBetweenSpawn = waveListToProcess[i].delayBetweenSpawn * 60;
			waveListToProcess[i].timerCache = 0;
			waveListToProcess[i].isActive = false;
			if (i == 0) waveListToProcess[i].isActive = true;
		}
		this.waveList = waveListToProcess;
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
		this.map = mapToProcess.map;

		for(let i = 0; i < mapToProcess.map.length; i++)
		{
			if(mapToProcess.map[i] != false)
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
								this.mapTurretPos.push({indexX: x, indexY: y});
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
			for(let t = 0; t < this.mapTurretPos.length; t++)
			{
				this.map[this.pathList[i]][this.mapTurretPos[t].indexX][this.mapTurretPos[t].indexY] = 4;
			} 		
		}

	}

}
