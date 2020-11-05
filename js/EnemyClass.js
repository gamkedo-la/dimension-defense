
function EnemyClass(){
	
	this.radius;
	this.color;

	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.moveToX;
	this.moveToY;

	this.speed;
	this.status;
	this.onMapPath;

	this.pathQueue;
	this.hasGum = false;
	this.isDead = false;

	//move things here
	this.move = function (){
		if(this.pathQueue.length == 0 && !this.hasGum)
		{
			this.hasGum = true;
			this.findPathTo(gameLoop.returnGoalPos(this.pathNumber))
		}
		else if (this.pathQueue.length == 0 && this.hasGum)
		{
			this.isDead = true;
		}
		
		this.walk();
	}


	//draw things here
	this.draw = function(){

		colorCircle(this.x, this.y, this.radius, this.color);

	}

	//Inititalize
	this.init = function(indexX, indexY, pathNumber)
	{
		this.radius = 20;
		this.color = "red";
		this.speed = 2;

		this.indexX = indexX;
		this.indexY = indexY;

		this.x = returnPixelPosFromIndexPos(indexX, 'x') + TILE_SIZE / 2;
		this.y = returnPixelPosFromIndexPos(indexY, 'y') - TILE_SIZE / 2
		this.pathNumber = pathNumber;
		this.pathQueue = this.findPathTo(gameLoop.returnGumPos(this.pathNumber))
	}

	this.findPathTo = function(goalIndexPos)
	{
		return findPath(this, goalIndexPos, this.pathNumber);
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
