
function LaserTowerClass(){

	
	this.tower = "laserTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.image;
	this.imaheBase;

	this.level = 0;
	this.price = [100, 200]

	this.shootSpeed;
	this.reloadTime;
	this.shootColor;
	this.shootR;
	this.shootDamage;

	this.r;
	this.angle = 45;
	this.shotList = [];

	this.isMouseHovering = false;
	this.hoverColor = "#8730d9"
	this.hoverAlpha = 1;

	//move things here
	this.move = function (){

		let collidedEnemy = collisionCheckWithAllEnemy(this.x, this.y, this.r);

		if(collidedEnemy !== false)
		{
			this.angle = getAngleBetween2PointsInRadian(this.x, this.y, gameLoop.enemyList[collidedEnemy[0]].x, gameLoop.enemyList[collidedEnemy[0]].y);
			if(gameTimer % this.reloadTime == 0)	this.shoot();
		}
		
		for (let i = this.shotList.length - 1; i >= 0; i--)
		{
			if (this.shotList[i].isDead){
				this.shotList.splice(i, 1);
			} else {
				this.shotList[i].x += Math.cos(this.shotList[i].angle) * this.shotList[i].speed;
				this.shotList[i].y += Math.sin(this.shotList[i].angle) * this.shotList[i].speed;
				let hasHit = collisionCheckWithAllEnemy(this.shotList[i].x, this.shotList[i].y, this.shotList[i].r)
				
				if(hasHit !== false){
					gameLoop.enemyList[hasHit[0]].takeHit(this.shotList[i].damage);
					this.shotList[i].isDead = true;
				} else if (this.shotList[i].x > canvas.width || this.shotList[i].x < 0 || this.shotList[i].y > canvas.height || this.shotList[i].y < 0){
					this.shotList[i].isDead = true;
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
		if (this.image) { 
			drawBitmapCenteredWithRotation(this.image, this.x , this.y , this.angle)
		}	

		for(let i = 0; i < this.shotList.length; i++)
		{
			spinAng = this.shotList[i].angle;
			angledLine(this.shotList[i].x, this.shotList[i].y, 20, spinAng, this.shotList[i].color);
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

	this.shoot = function()
	{
		let dX = Math.cos(this.angle);
		let dY = Math.sin(this.angle);
		let newShot = {
			x: this.x + dX * 24,
			y: this.y + dY * 24,
			dX: dX,
			dY: dY,
			r: this.shootR,
			angle: this.angle,
			color: this.shootColor,
			speed: this.shootSpeed,
			damage: this.shootDamage,
			isDead: false
		};
		this.shotList.push(newShot);
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
		this.imageBase = 'LaserTowerBase';
		this.image = 'LaserTower';

		switch(this.level){
			case 1:
				this.r = 70;
				this.shootSpeed = 2.5;
				this.shootColor = '#FF0000';
				this.shootR = 5;
				this.shootDamage = 1;
				this.reloadTime = 140;
				break;
			case 2:
				this.r = 80;
				this.shootSpeed = 3;
				this.shootColor = '#FF8888';
				this.shootR = 6;
				this.shootDamage = 2;
				this.reloadTime = 90;
				break;
			case 3:
				this.r = 90;
				this.shootSpeed = 40;
				this.shootColor = '#FFAAAA';
				this.shootR = 7;
				this.shootDamage = 3;
				this.reloadTime = 50;
				break;
		}
	}


}
