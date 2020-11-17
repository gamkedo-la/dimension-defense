
function BasicTuretClass(){

	this.x;
	this.y;
	this.indexX;
	this.indexY;

	this.speed = 2;
	this.r = 60;
	this.angle = 45;
	this.shotList = [];

	//move things here
	this.move = function (){

		let collidedEnemy = this.collisionCheckWithAllEnemy(this.x, this.y, this.r);

		if(collidedEnemy !== false)
		{
			this.angle = getAngleBetween2PointsInRadian(this.x, this.y, gameLoop.enemyList[collidedEnemy].x, gameLoop.enemyList[collidedEnemy].y);
			if(gameTimer % 20 == 0)	this.shoot();
		}
		
		for (let i = this.shotList.length - 1; i >= 0; i--)
		{
			if (this.shotList[i].isDead)
			{
				this.shotList.splice(i, 1);
			}
			else
			{
				this.shotList[i].x += Math.cos(this.shotList[i].angle) * this.shotList[i].speed;
				this.shotList[i].y += Math.sin(this.shotList[i].angle) * this.shotList[i].speed;
				let hasHit = this.collisionCheckWithAllEnemy(this.shotList[i].x, this.shotList[i].y, this.shotList[i].r)
				if(hasHit !== false){
					gameLoop.enemyList[hasHit].takeHit(1);
					this.shotList[i].isDead = true;
				}
			}
		}
		
	}


	//draw things here
	this.draw = function(){
		//colorCircle(this.x, this.y, this.r, 'red');
		drawBitmapCenteredWithRotation("basicTurret", this.x, this.y, this.angle)
		for(let i = 0; i < this.shotList.length; i++)
		{
			colorCircle(this.shotList[i].x, this.shotList[i].y, this.shotList[i].r, this.shotList[i].color);
		}

	}

	//Inititalize
	this.init = function(indexX, indexY)
	{
		this.indexX = indexX;
		this.indexY = indexY;

		this.x = returnPixelPosFromIndexPos(indexX) + TILE_SIZE / 2;
		this.y = returnPixelPosFromIndexPos(indexY) + TILE_SIZE / 2;
	}

	this.shoot = function()
	{
		let dX = Math.cos(this.angle);
		let dY = Math.sin(this.angle);
		let newShot = {
			x: this.x + dX * 24,
			y: this.y + dY * 24,
			dX: dX,
			dY: dY,
			r: 5,
			angle: this.angle,
			color: 'green',
			speed: 3,
			isDead: false
		};
		this.shotList.push(newShot);
	}

	this.collisionCheckWithAllEnemy = function(x, y, r)
	{
		for(let i = 0; i < gameLoop.enemyList.length; i++)
		{
			if(collisionCheckRoundShapes(x, y, r, gameLoop.enemyList[i].x, gameLoop.enemyList[i].y, gameLoop.gums[i].r))
			{
				return i;
			}		
		}
		return false;
	}

}
