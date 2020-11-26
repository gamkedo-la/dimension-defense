
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
	this.imgName;

	this.status;
	this.pathNumber;
	this.pathQueue;

	this.gumsForMe;
	this.myGum = false;
	this.hasVisitedAltar = false;

	this.isDead = false;
	this.canBeRemoved = false;

	//Abilities
	this.immuneToSlowdown = false;

	this.id=0;  //1.this variable is used to tell the animationSystem which object it is.

	//move things here
	this.move = function (){

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

		if(this.myGum !== false)
		{
			gameLoop.gums[this.myGum].x = this.x;
			gameLoop.gums[this.myGum].y = this.y;
		}

		//reset the slowdown effect
		this.speed = this.defaultSpeed;

	}


	//draw things here
	this.draw = function(){

		//updates the animation
		if(!this.isDead)
		{
			//animationSystem.sprite_update(this.id,{X:this.x -16,Y:this.y + -16});
		}

		//colorCircle(this.x + offsetX, this.y + offsetY, this.r, this.color);
		drawBitmapCenteredWithRotation(this.imgName, this.x + offsetX, this.y + offsetY, 0);

		let healthBarW = 30;
		let healthBarH = 6;
		colorRect(this.x + offsetX - healthBarW/2,this.y + offsetY - 20, healthBarW, healthBarH, "red");
		colorRect(this.x + offsetX - 15,this.y + offsetY - 20, this.health/this.maxHealth * healthBarW, healthBarH, "green");
		
	}

	this.isDeadMove = function(){

		if(this.myGum !== false)
		{
			gameLoop.gums[this.myGum].hasOwner = false;
			
			

		}
		this.canBeRemoved = true;
		animationSystem.destroyEntity(this.id)
		
		
	}

	//Inititalize
	this.init = function(pathNumber, enemyType)
	{

		for (let i = 0; i < enemyList.length; i++)
		{
			if(enemyType == enemyList[i].type)
			{
				this.imgName = enemyList[i].imgName;
				this.maxHealth = enemyList[i].health;
				this.defaultSpeed = enemyList[i].speed;
				this.coins = enemyList[i].coins;
				this.r = enemyList[i].r;
				for (let a = 0; a < enemyList[i].ability.length; a++)
				{
					switch (enemyList[i].ability[a]) {
						case 'immuneToSlowdown':
							this.immuneToSlowdown = true;
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
		

		this.gumsForMe = gameLoop.returnGumListIndex(pathNumber);	
		this.pathQueue = this.findPathTo(gameLoop.returnGumAltarPos(pathNumber) )

		//2.creates a graphical representation of itself in through the animation system
		this.id=animationSystem.register("testEnemy1",8,{X:this.x,Y:this.y});
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
			playerCoins = playerCoins + this.coins;
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
