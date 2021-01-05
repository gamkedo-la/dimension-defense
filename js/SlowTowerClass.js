
function SlowTowerClass(){

	this.tower = "slowdownTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.image;

	this.level = 0;
	this.price = [150, 250]

	this.r;
	this.slowdownAmount;

	//Hover function not in use
	this.isMouseHovering = false;
	this.hoverColor = "#8730d9"
	this.hoverAlpha = 1;

	//move things here
	this.move = function (){

		let collidedEnemy = collisionCheckWithAllEnemy(this.x, this.y, this.r);
		
		if(collidedEnemy !== false)
		{
			for(let i = 0; i < collidedEnemy.length; i++)
			{
				if(!gameLoop.enemyList[collidedEnemy[i]].isDead)
				{
					this.slowdownEnemy(collidedEnemy[i]);
				}
			}
		}	
	}


	//draw things here
	this.draw = function(){
		drawBitmapCenteredWithRotation(this.image, this.x, this.y, 0)

	}

	//Inititalize
	this.init = function(indexX, indexY)
	{
		this.indexX = indexX;
		this.indexY = indexY;

		this.x = returnPixelPosFromIndexPos(indexX) + TILE_SIZE / 2;
		this.y = returnPixelPosFromIndexPos(indexY) + TILE_SIZE / 2;

		this.upgrade();
	}

	this.isUpgradeable = function()
	{
		if(this.level < 3){
			return true;
		}
		//else
		return false;
	}

	this.getUpgradePrice = function()
	{
		return this.price[this.level-1];
	}

	this.upgrade = function()
	{
		this.level++;
		this.image = "slowTowerL" + this.level;

		switch(this.level){
			case 1:
				this.r = 70;
				this.slowdownAmount = 1;
				break;
			case 2:
				this.r = 70;
				this.slowdownAmount = 1.5;
				break;
			case 3:
				this.r = 140;
				this.slowdownAmount = 2;
				break;
		}
	}

	this.slowdownEnemy = function(enemy)
	{
		gameLoop.enemyList[enemy].slowdownSpeed(4);
	}

}
