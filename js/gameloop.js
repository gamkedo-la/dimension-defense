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
	this.turretPosList = [];
	this.startPosList = [];
	this.goalPosList = [];
	this.gumPosList = [];

	this.waveList = [];
	this.enemyList = [];

	//move things here
	this.move = function (){
		gameTimer++;

		//Just a place holder until wave system is done
		for(let i = 0; i < this.startPosList.length; i++)
		{
			if(gameTimer % 200 == 0 && this.startPosList[i] != false)
			{
				this.spawnEnemy(this.startPosList[i].indexX, this.startPosList[i].indexY, i)				
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

	}


	//draw things here
	this.draw = function(){
		//draw map
		drawImageWithAngle(this.mapName, offsetX, offsetY, 0);

		for(let i = 0; i < this.enemyList.length; i++)
		{
			this.enemyList[i].draw();
		}
	}

	this.spawnEnemy = function(atIndexX, atIndexY, pathNumber)
	{
		let newEnemy = new EnemyClass();
		newEnemy.init(atIndexX, atIndexY, pathNumber);
		this.enemyList.push(newEnemy);
				
	}

	this.returnGumPos = function(onPath)
	{
		return this.gumPosList[onPath]
	}

	this.returnGoalPos = function(onPath)
	{
		return this.gumPosList[onPath]
	}

	this.returnMapOfPath = function(pathNumber)
	{
		return this.map[pathNumber]
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

	}

	this.resetGame = function()
	{
		gameTimer = 0;

		this.map = [];
		this.pathList = [];
		this.turretPosList = [];
		this.startPosList = [];
		this.goalPosList = [];
		this.gumPosList = [];
	
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
								this.startPosList[i] = {indexX: x, indexY: y};
								break;
							case 2:
								if(!this.pathList.includes(i)) this.pathList.push(i);								
								break;
							case 3:
								this.goalPosList[i] = {indexXx: x, indexY: y};
								break;
							case 4:
								this.turretPosList.push({indexX: x, indexY: y});
								break;
							case 5:
								this.gumPosList[i] = {indexX: x, indexY: y};
								break;
						}
					}
				}
			}else{
				this.startPosList[i] = false;
				this.goalPosList[i] = false;
				this.turretPosList[i] = false;
				this.gumPosList[i] = false;
			}
		}
	}
}
