
function ElectricTowerClass(){

	this.tower = "electroTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.imagePassiv;
	this.imageActive;
	this.angle = 0;

	this.level = 0;
	this.price = [250, 450];

	this.r;
	this.damge;
	this.dotRate;
	this.isActive;

	//move things here
	this.move = function (){
		this.isActive = false;

		let collidedEnemy = collisionCheckWithAllEnemy(this.x, this.y, this.r);

		if(collidedEnemy !== false)
		{
			this.isActive = true;
			for(let i = 0; i < collidedEnemy.length; i++)
				{
					this.electrecudeEnemy(collidedEnemy[i]);
				}
		}
		
	}


	//draw things here
	this.draw = function(){

		if(gameTimer % this.dotRate == 0)
		{
			this.angle = degreesToRadian(Math.floor(Math.random() * Math.floor(360)));
		}

		if(this.isActive)
		{
			drawBitmapCenteredWithRotation(this.imageActive, this.x + offsetX, this.y + offsetY, this.angle)
		}
		else
		{
			drawBitmapCenteredWithRotation(this.imagePassiv, this.x + offsetX, this.y + offsetY, 0)
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
		this.imagePassiv = "ElectricTowerL" + this.level + "P";
		this.imageActive = "ElectricTowerL" + this.level + "A";

		switch(this.level){
			case 1:
				this.r = 70;
				this.damge = 1;
				this.dotRate = 90;
				break;
			case 2:
				this.r = 70;
				this.damge = 2;
				this.dotRate = 80;
				break;
			case 3:
				this.r = 120;
				this.damge = 3;
				this.dotRate = 70;
				break;
		}
	}

	this.electrecudeEnemy = function(enemy)
	{
		gameLoop.enemyList[enemy].getElectrecuted(this.damge,this.dotRate);
	}

}
