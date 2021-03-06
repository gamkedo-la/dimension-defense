
function GunTowerClass(){

	
	this.tower = "gunTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.image;
	this.imageBase;
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
			for(let i = 0; i < collidedEnemy.length; i++)
			{
				if(!gameLoop.enemyList[collidedEnemy[i]].isDead)
				{
					this.angle = getAngleBetween2PointsInRadian(this.x, this.y, gameLoop.enemyList[collidedEnemy[i]].x, gameLoop.enemyList[collidedEnemy[i]].y);
					if(gameTimer % this.reloadTime == 0)
					{
						this.shoot();
						sfxGunTowerShoot.play();
					}
					break;
				}
			}
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
		drawBitmapCenteredWithRotation(this.imageBase, this.x , this.y , 0)
		drawBitmapCenteredWithRotation(this.image, this.x , this.y , this.angle)
		for(let i = 0; i < this.shotList.length; i++)
		{
			colorCircle(this.shotList[i].x , this.shotList[i].y , this.shotList[i].r, this.shotList[i].color);
		}
	}

	this.mouseHover = function(){

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
		this.image = "gunTowerL" + this.level;
		this.imageBase = "gunTowerBaseL" + this.level;

		switch(this.level){
			case 1:
				this.r = 70;
				this.shootSpeed = 5;
				this.shootColor = '#1abdd6';
				this.shootR = 5;
				this.shootDamage = 5;
				this.reloadTime = 40;
				break;
			case 2:
				this.r = 80;
				this.shootSpeed = 10;
				this.shootColor = '#d323d9';
				this.shootR = 6;
				this.shootDamage = 9;
				this.reloadTime = 30;
				break;
			case 3:
				this.r = 90;
				this.shootSpeed = 15;
				this.shootColor = '#db2531';
				this.shootR = 7;
				this.shootDamage = 12;
				this.reloadTime = 20;
				break;
		}
	}


}
