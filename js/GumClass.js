
function GumClass(){

	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.moveToX;
	this.moveToY;
	this.image;

	this.r = 20;
	this.defaultSpeed = 1;
	this.speed = 1;
	this.altar;
	this.isDead = false;
	this.hasOwner = false;
	this.isOnAltar = true;

	this.rot = 0;
	this.isImgSideview;
	this.status;
	this.pathNumber;
	this.pathQueue;

	//move things here
	this.move = function (){
		// TODO: Did not finish yet. Will uncomment when i finish it  --bariskoklu
		if (this.isFreeToGrab() && !this.isOnAltar) {
			this.indexX = returnIndexPosFromPixelPos(this.x);
			this.indexY = returnIndexPosFromPixelPos(this.y);
			this.moveBackToSpawn();
		}
	}


	//draw things here
	this.draw = function(){
		if(this.isDead)
		{
			return;
		}
		
		drawBitmapCenteredWithRotation(this.image, this.x , this.y, 0);

	}

	this.moveBackToSpawn = function(){
		this.walk();
	}

	this.checkForEvents = function()
	{

		if(gameLoop.returnGumAltarPos(this.pathNumber).indexX == this.indexX && gameLoop.returnGumAltarPos(this.pathNumber).indexY == this.indexY)
		{
			this.isOnAltar = true;
		}
	}

	this.searchPath = function()
	{

		this.checkForEvents();

		if(this.isOnAltar)
		{
			return;
		}

	  this.pathQueue = this.runPathsearchAlgorithm(gameLoop.returnGumAltarPos(this.pathNumber))
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

	this.removeOwner = function()
	{
		this.hasOwner = false;
	}

	this.addOwner = function(owner)
	{
		this.hasOwner = true;
	}

	this.isFreeToGrab = function()
	{
		if(this.hasOwner === false && this.isDead === false)
		{
			return true;
		}

		//else
		return false;
	}

	this.getKilled = function()
	{
		this.isDead = true;
	}

	this.setPosition = function(x, y)
	{
		this.x = x;
		this.y = y;
	}

	//Inititalize
	this.init = function(pathNumber, gumImage)
	{
		this.x = returnPixelPosFromIndexPos(gameLoop.returnGumAltarPos(pathNumber).indexX) + TILE_SIZE / 2;
		this.y = returnPixelPosFromIndexPos(gameLoop.returnGumAltarPos(pathNumber).indexY) + TILE_SIZE / 2;
		this.indexX = gameLoop.returnGumAltarPos(pathNumber).indexX;
		this.indexY = gameLoop.returnGumAltarPos(pathNumber).indexY;
		this.altar = pathNumber;
		this.image = gumImage;
	}

}
