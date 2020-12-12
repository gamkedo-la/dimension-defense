
function EnemyClass(){

	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.moveToX;
	this.moveToY;

	this.r;
	this.defaultSpeed;
	this.speed;
	this.maxHealth;
	this.health;
	this.coins;

	this.imgName;
	this.rot = 0;
	this.isImgSideview;
	this.flipImg = false;
	this.status;
	this.pathNumber;
	this.pathQueue;

	this.myGum = false;
	this.hasVisitedAltar = false;
	this.hasReachedGoal = false;
	this.isDead = false;
	this.canBeRemoved = false;

	//Abilities
	this.immuneToSlowdown = false;
	this.speedUpWhenElectrecuted = false;

	this.spriteID;  //1.this variable is used to tell the animationSystem which object it is.

	//move things here
	this.move = function (){
		if(this.isDead)
		{
			this.isDeadMove();
			return;
		}
		this.indexX = returnIndexPosFromPixelPos(this.x);
		this.indexY = returnIndexPosFromPixelPos(this.y);

		if(this.hasReachedGoal)
		{
			this.canBeRemoved = true;
			gameLoop.gums[this.myGum].getKilled();
			return;
		}

		if(this.myGum === false)
		{
			for(let i = 0; i < gameLoop.gums.length; i++)
			{
				if(gameLoop.gums[i].isFreeToGrab())
				{
					if(this.collisionCheckWithGum(i))
					{
						this.myGum = i;
						gameLoop.gums[i].addOwner();
						break;
					}
				}
			}
		}

		this.walk();

		if(this.myGum !== false)
		{
			gameLoop.gums[this.myGum].setPosition(this.x, this.y)
		}

		animationSystem.sprite_update(this.spriteID,{X:this.x,Y:this.y,ROT:this.rot});
		
		if(this.flipImg)
		{
			animationSystem.flipSprite(this.spriteID,true,false);
		}else{
			animationSystem.flipSprite(this.spriteID,false,false);
		}

		//reset the speed effect
		this.speed = this.defaultSpeed;

	}


	//draw things here
	this.draw = function(){

		animationSystem.draw_anim_loop(this.spriteID, 5)
	
		let healthBarW = 30;
		let healthBarH = 6;
		colorRect(this.x + offsetX - healthBarW/2,this.y + offsetY - 30, healthBarW, healthBarH, "red");
		colorRect(this.x + offsetX - 15,this.y + offsetY - 30, this.health/this.maxHealth * healthBarW, healthBarH, "green");

		animationSystem.draw_anim_loop(this.spriteID, 5)
	}

	this.isDeadMove = function(){

		if(this.myGum !== false)
		{
			gameLoop.gums[this.myGum].pathNumber = this.pathNumber;
			gameLoop.gums[this.myGum].isOnAltar = false;
			gameLoop.gums[this.myGum].indexX = this.indexX;
			gameLoop.gums[this.myGum].indexY = this.indexY;
			gameLoop.gums[this.myGum].searchPath();
			gameLoop.gums[this.myGum].removeOwner();
		}
		this.canBeRemoved = true;


	}

	//Inititalize
	this.init = function(pathNumber, enemyType)
	{
		let sprite;

		for (let i = 0; i < enemyList.length; i++)
		{
			if(enemyType == enemyList[i].type)
			{
				this.imgName = enemyList[i].imgName;
				this.maxHealth = enemyList[i].health;
				this.defaultSpeed = enemyList[i].speed;
				this.coins = enemyList[i].coins;
				this.r = enemyList[i].r;
				this.isImgSideview = enemyList[i].isImgSideview;
				sprite = enemyList[i].sprite;
				for (let a = 0; a < enemyList[i].ability.length; a++)
				{
					switch (enemyList[i].ability[a]) {
						case 'immuneToSlowdown':
							this.immuneToSlowdown = true;
							break;
						case 'speedUpWhenElectrecuted':
							this.speedUpWhenElectrecuted = true;
							break;
					}
				}
				break;
			}
		}

		this.health = this.maxHealth;
		this.speed = this.defaultSpeed;
		this.pathNumber = pathNumber;
		this.indexX = gameLoop.returnStartPos(pathNumber).indexX;
		this.indexY = gameLoop.returnStartPos(pathNumber).indexY;

		this.x = returnPixelPosFromIndexPos(this.indexX) + TILE_SIZE / 2 ;
		this.y = returnPixelPosFromIndexPos(this.indexY) + TILE_SIZE / 2;

		this.searchPath();

		//2.creates a graphical representation of itself in through the animation system
		this.spriteID=animationSystem.register(sprite,5,{X:this.x,Y:this.y});
		//console.log(this.id);

	}

	this.collisionCheckWithGum = function(gumListIndex)
	{
		return (collisionCheckRoundShapes(
			this.x, this.y, this.r,
			gameLoop.gums[gumListIndex].x, gameLoop.gums[gumListIndex].y, gameLoop.gums[gumListIndex].r)
		)
	}

	this.takeHit = function(damageAmount)
	{
		this.health -= damageAmount;
		if(this.health <= 0){
			this.isDead = true;
			gameLoop.addCoins(this.coins);
			animationSystem.destroyEntity(this.id)

		}
	}

	this.getElectrecuted = function(damageAmount, hitRate)
	{
		if(this.speedUpWhenElectrecuted)
		{
			this.speed += 2;
		}

		if(gameTimer % hitRate == 0)
		{
			this.takeHit(damageAmount);
		}
	}

	this.slowdownSpeed = function(slowdownAmount)
	{
		if(!this.immuneToSlowdown)
		{
			this.speed -= slowdownAmount;

			if(this.speed <= 0){
				this.speed = 1;
			}
		}
	}

	this.checkForEvents = function()
	{

		if(gameLoop.returnGumAltarPos(this.pathNumber).indexX == this.indexX && gameLoop.returnGumAltarPos(this.pathNumber).indexY == this.indexY
			|| this.myGum !== false)
		{
			this.hasVisitedAltar = true;
		}
		if(gameLoop.returnGoalPos(this.pathNumber).indexX == this.indexX && gameLoop.returnGoalPos(this.pathNumber).indexY == this.indexY)
		{
			this.hasReachedGoal = true;
		}

	}


	this.searchPath = function()
	{

		this.checkForEvents();

		if(this.hasReachedGoal)
		{
			animationSystem.destroyEntity(this.id);
			return;
		}

		if(!this.hasVisitedAltar)
		{
			this.pathQueue = this.runPathsearchAlgorithm(gameLoop.returnGumAltarPos(this.pathNumber))
		}else{
			this.pathQueue = this.runPathsearchAlgorithm(gameLoop.returnGoalPos(this.pathNumber))
		}
		this.status = undefined;
	}

	this.runPathsearchAlgorithm = function(goalIndexPos)
	{
		let testPath = findPath(this, goalIndexPos, this.pathNumber, false, false);
		if(testPath !== false)
		{
			return testPath;
		}
		testPath = findPath(this, goalIndexPos, this.pathNumber, true, false);
		if(testPath !== false)
		{
			return testPath;
		}
		testPath = findPath(this, goalIndexPos, this.pathNumber, true, true);
		if(testPath !== false)
		{
			return testPath;
		}
	}

	this.walk = function(){
	// 0 = North
	// 1 = East
	// 2 = South
	// 3 = West
		if(this.pathQueue.length == 0){
			this.status = undefined;
			console.log("No Path to walk")
			return;
		}else{
			if(this.pathQueue[0] == 0){
				if(this.status != 'WALKING_NORTH'){
					this.moveToY = this.y - TILE_SIZE;
					this.status = 'WALKING_NORTH';
					this.rot = degreesToRadian(270);
					this.flipImg = false;
					this.y -= this.speed;
				}else if(this.y <= this.moveToY){
					this.y = this.moveToY;
					this.searchPath();
				}else{
					this.y -= this.speed;
				}

			}else if(this.pathQueue[0] == 2){
				if(this.status != 'WALKING_SOUTH'){
					this.moveToY = this.y + TILE_SIZE;
					this.status = 'WALKING_SOUTH';
					this.rot = degreesToRadian(90);
					this.flipImg = false;
					this.y += this.speed;
				}else if(this.y >= this.moveToY){
					this.y = this.moveToY;
					this.searchPath();
				}else{
					this.y += this.speed;
				}

			}else if(this.pathQueue[0] == 1){
				if(this.status != 'WALKING_EAST'){
					this.moveToX = this.x + TILE_SIZE;
					this.status = 'WALKING_EAST';
					this.rot = degreesToRadian(0);
					this.flipImg = false;
					this.x += this.speed;
				}else if(this.x >= this.moveToX){
					this.x = this.moveToX;
					this.searchPath();
				}else{
					this.x += this.speed;
				}

			}else if(this.pathQueue[0] == 3){
				if(this.status != 'WALKING_WEST'){
					this.moveToX = this.x - TILE_SIZE;
					this.status = 'WALKING_WEST';
					this.rot = degreesToRadian(180);
					if(this.isImgSideview)
					{
						this.rot = degreesToRadian(0);
						this.flipImg = true;
					}
					this.x -= this.speed;
				}else if(this.x <= this.moveToX){
					this.x = this.moveToX;
					this.searchPath();
				}else{
					this.x -= this.speed;
				}
			}
		}
	}


}
