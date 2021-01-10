function FlameTowerClass(){

	this.tower = "flameTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.image;
	this.imageBase
	this.imagePassive;
	this.imageActive;

	this.level = 0;
	this.price = [100, 200]

	this.damage;
	this.dotRate;
	this.isActive;

	this.r;
	this.angle = 0;
	this.shotList = [];
	this.isMouseHovering = false;
	this.hoverColor = "#8730d9"
	this.hoverAlpha = 1;

	//move things here
	this.move = function (){
		let collidedEnemy = collisionCheckWithAllEnemy(this.x, this.y, this.r);

		if(collidedEnemy !== false)
		{
			this.isActive = true;
			for(let i = 0; i < collidedEnemy.length; i++)
			{
				if(!gameLoop.enemyList[collidedEnemy[i]].isDead)
				{
					this.angle = getAngleBetween2PointsInRadian(this.x, this.y, gameLoop.enemyList[collidedEnemy[i]].x, gameLoop.enemyList[collidedEnemy[i]].y);
					this.roastEnemy(collidedEnemy[i]);
					if(sfxFlameTowerShoot.isPaused())
					{
						sfxFlameTowerShoot.play();
					}	
				}
			}
		}
	}


	//draw things here
	this.draw = function(){
		if(this.isMouseHovering)
		{
			colorCircleWithAlpha(this.x , this.y , this.r, this.hoverColor,this.hoverAlpha);
		}
		if (this.imageBase) { 
		    drawBitmapCenteredWithRotation(this.imageBase, this.x, this.y, 0);
		}
		if(this.isActive)
		{
			drawBitmapCenteredWithRotation(this.imageActive, this.x + 10, this.y, this.angle);
		}
		else
		{
			// draw the part that rotates
			drawBitmapCenteredWithRotation(this.imagePassive, this.x + 10, this.y, this.angle);
		}
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

	this.roastEnemy = function(enemy)
	{
		gameLoop.enemyList[enemy].getElectrecuted(this.damage,this.dotRate);

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
		this.imageBase = 'FlameTowerBaseL' + this.level;
		this.imagePassive = 'FlameTowerPassiveL' + this.level;
		this.imageActive = "FlameTowerActiveL" + this.level;

		switch(this.level){
			case 1:
				this.r = 70;
				this.damage = 1;
				this.dotRate = 90;
				break;
			case 2:
				this.r = 80;
				this.damage = 2;
				this.dotRate = 80;
				break;
			case 3:
				this.r = 90;
				this.damage = 3;
				this.dotRate = 70;
				break;
		}
	}
}
