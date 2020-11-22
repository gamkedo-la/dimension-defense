
function SlowTowerClass(){

	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.type = 'slowTower';

	this.speed = 2;
	this.r = 70;
	this.angle = 0;

	//move things here
	this.move = function (){

		let collidedEnemy = collisionCheckWithAllEnemy(this.x, this.y, this.r);

		if(collidedEnemy !== false)
		{
			for(let i = 0; i < collidedEnemy.length; i++)
			{
				this.slowdownEnemy(collidedEnemy[i]);
			}
		}	
	}


	//draw things here
	this.draw = function(){
		drawBitmapCenteredWithRotation("slowTower", this.x + offsetX, this.y + offsetY, this.angle)

	}

	//Inititalize
	this.init = function(indexX, indexY)
	{
		this.indexX = indexX;
		this.indexY = indexY;

		this.x = returnPixelPosFromIndexPos(indexX) + TILE_SIZE / 2;
		this.y = returnPixelPosFromIndexPos(indexY) + TILE_SIZE / 2;
	}

	this.slowdownEnemy = function(enemy)
	{
		gameLoop.enemyList[enemy].slowdownSpeed(4);
	}

}
