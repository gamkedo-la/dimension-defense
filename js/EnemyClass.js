
function EnemyClass(){
	
	this.r;
	this.color;

	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.moveToX;
	this.moveToY;
	this.cacheOffsetX = offsetX;
	this.cacheOffsetY = offsetY;

	this.speed;
	this.status;
	this.pathNumber;
	this.pathQueue;

	this.gumsForMe;
	this.myGum = false;
	this.hasVisitedAltar = false;
	this.health = 20;
	this.isDead = false;
	this.canBeRemoved = false;

	//move things here
	this.move = function (){

		this.x -= oldOffsetX;
		this.y -= oldOffsetY;

		this.indexX = returnIndexPosFromPixelPos(this.x);
		this.indexY = returnIndexPosFromPixelPos(this.y);

		if (!this.pathQueue) {
			console.log("Error: enemy has a null pathQueue");
			return;
		}

		if(this.pathQueue.length == 0 && !this.hasVisitedAltar)
		{
			for(let i = 0; i < this.gumsForMe.length; i++)
			{
				if(this.collisionCheckWithGum(this.gumsForMe[i]) && gameLoop.gums[this.gumsForMe[i]].hasOwner == false)
				{
					this.myGum = this.gumsForMe[i];
					gameLoop.gums[i].hasOwner = true;			
					break;
				}
			}
			this.pathQueue = this.findPathTo(gameLoop.returnGoalPos(this.pathNumber))
			this.hasVisitedAltar = true;
		}
		else if (this.pathQueue.length == 0 && this.hasVisitedAltar)
		{
			this.isDead = true;
		}

		this.walk();

		this.x += offsetX;
		this.y += offsetY;
		if(this.myGum !== false)
		{
			gameLoop.gums[this.myGum].x = this.x;
			gameLoop.gums[this.myGum].y = this.y;
		}	

	}


	//draw things here
	this.draw = function(){

		colorCircle(this.x, this.y, this.r, this.color);

	}

	this.isDeadMove = function(){

		if(this.myGum !== false)
		{
			gameLoop.gums[this.myGum].hasOwner = false;
		}
		this.canBeRemoved = true;

	}

	//Inititalize
	this.init = function(pathNumber, enemyType)
	{
		this.r = 10;
		this.color = enemyType;
		this.speed = 3;
		this.pathNumber = pathNumber;
		this.indexX = gameLoop.returnStartPos(pathNumber).indexX;
		this.indexY = gameLoop.returnStartPos(pathNumber).indexY;

		this.x = returnPixelPosFromIndexPos(this.indexX) + TILE_SIZE / 2 ;
		this.y = returnPixelPosFromIndexPos(this.indexY) + TILE_SIZE / 2;
		this.x += offsetX;
		this.y += offsetY;

		this.gumsForMe = gameLoop.returnGumListIndex(pathNumber);	
		this.pathQueue = this.findPathTo(gameLoop.returnGumAltarPos(pathNumber) )
	}

	this.collisionCheckWithGum = function(gumListIndex)
	{
		if(collisionCheckRoundShapes(this.x, this.y, this.r, gameLoop.gums[gumListIndex].x, gameLoop.gums[gumListIndex].y, gameLoop.gums[gumListIndex].r) )
		{
			return true;
		}		
		return false;
	}

	this.takeHit = function(damageAmount)
	{
		this.health -= damageAmount;
		if(this.health <= 0){
			this.isDead = true;
		}
	}


	this.findPathTo = function(goalIndexPos)
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
					this.y -= this.speed;
				}else if(this.y <= this.moveToY){
					this.y = this.moveToY;
					this.pathQueue = this.pathQueue.slice(1);
					this.status = undefined;
				}else{
					this.y -= this.speed;
				}

			}else if(this.pathQueue[0] == 2){		
				if(this.status != 'WALKING_SOUTH'){
					this.moveToY = this.y + TILE_SIZE;
					this.status = 'WALKING_SOUTH';
					this.y += this.speed;
				}else if(this.y >= this.moveToY){
					this.y = this.moveToY;
					this.pathQueue = this.pathQueue.slice(1);
					this.status = undefined;
				}else{
					this.y += this.speed;
				}

			}else if(this.pathQueue[0] == 1){		
				if(this.status != 'WALKING_EAST'){
					this.moveToX = this.x + TILE_SIZE;
					this.status = 'WALKING_EAST';
					this.x += this.speed;
				}else if(this.x >= this.moveToX){
					this.x = this.moveToX;
					this.pathQueue = this.pathQueue.slice(1);
					this.status = undefined;
				}else{ 
					this.x += this.speed;
				}

			}else if(this.pathQueue[0] == 3){			
				if(this.status != 'WALKING_WEST'){
					this.moveToX = this.x - TILE_SIZE;
					this.status = 'WALKING_WEST';
					this.x -= this.speed;
				}else if(this.x <= this.moveToX){
					this.x = this.moveToX;
					this.pathQueue = this.pathQueue.slice(1);
					this.status = undefined;
				}else{
					this.x -= this.speed;
				}
			}
		}
	}


}
