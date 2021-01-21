
function TestTowerClass(){

	
	this.tower = "testTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.image;

	this.level = 0;
	this.price = [100, 200]

	this.shootSpeed;
	this.reloadTime;
	this.shootColor;
	this.shootR;
	this.shootDamage;
	this.shotActive = false;

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
						if(sfxSlowdownTowerShoot.isPaused())
						{
							sfxSlowdownTowerShoot.play();
						}
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
	
		if (this.image) { 
			drawBitmapCenteredWithRotation(this.image, this.x , this.y , this.angle)
		}	

		for(let i = 0; i < this.shotList.length; i++)
		{
			spinAng = this.shotList[i].angle;
			angledLineThicker(this.shotList[i].x, this.shotList[i].y, 20, spinAng, this.shotList[i].color);
		}

	}

	//Inititalize
	this.init = function(indexX, indexY)
	{
		this.indexX = indexX;
		this.indexY = indexY;
		this.image = 'slowTowerL4';

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
			y: (this.y + 10) + dY * 24,
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

		switch(this.level){
			case 1:
				this.r = 100;
				this.shootSpeed = 3;
				this.shootColor = '#FF0000';
				this.shootR = 10;
				this.shootDamage = 4;
				this.reloadTime = 90;
				break;
			case 2:
				this.r = 200;
				this.shootSpeed = 4;
				this.shootColor = '#FF8888';
				this.shootR = 12;
				this.shootDamage = 6;
				this.reloadTime = 50;
				break;
			case 3:
				this.r = 300;
				this.shootSpeed = 5;
				this.shootColor = '#FFAAAA';
				this.shootR = 12;
				this.shootDamage = 9;
				this.reloadTime = 30;
				break;
		}
	}


}
