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
	this.imageMuzzleFlash = "flameMuzzleFlash";
    this.muzzleFlashAlpha = 0;

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
					break;
				}
			}
		}else{
			this.isActive = false;
			if(!sfxFlameTowerShoot.isPaused())
			{
				sfxFlameTowerShoot.stop();
			}
		}
	}


	//draw things here
	this.draw = function(){
		if(this.isMouseHovering)
		{
			colorCircleWithAlpha(this.x , this.y , this.r, this.hoverColor,this.hoverAlpha);
		}
		
		drawBitmapCenteredWithRotation(this.imageBase, this.x, this.y, 0);
		
		if(this.isActive)
		{
			if (this.muzzleFlashAlpha<0.1) this.muzzleFlashAlpha = 1; // reset while active
		}

        // always draw inactive version
		drawBitmapCenteredWithRotation(this.imagePassive, this.x , this.y, this.angle);

		// flickering fire and active sprite
		if (this.muzzleFlashAlpha>0) {
            ctx.globalAlpha = this.muzzleFlashAlpha;
            this.muzzleFlashAlpha -= 0.025; // fade out
            drawBitmapCenteredWithRotation(this.imageMuzzleFlash, this.x+Math.random()*10-5, this.y+Math.random()*10-5, this.angle);//+Math.random()*0.5-0.25);		
            drawBitmapCenteredWithRotation(this.imageActive, this.x, this.y, this.angle);			
            ctx.globalAlpha = 1;
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
				this.damage = 10;
				this.dotRate = 65;
				break;
			case 2:
				this.r = 75;
				this.damage = 15;
				this.dotRate = 60;
				break;
			case 3:
				this.r = 80;
				this.damage = 20;
				this.dotRate = 60;
				break;
		}
	}
}
