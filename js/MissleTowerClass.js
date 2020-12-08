
function MissleTowerClass(){

	
	this.tower = "missleTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.image;

    // FIXME perhaps these should be set later, after all inits? seems ok
	this.image = "MissileTowerTurret";
	this.imageBase = "MissileTowerBase";
	this.imageProjectile = "Missile";
	this.imageMuzzleFlash = "MuzzleFlash";
	this.muzzleFlashAlpha = 0;

	this.level = 0;
	this.price = [200, 300]

	this.shootSpeed;
	this.reloadTime;
	this.shootColor;
	this.shootR;
	this.shootDamage;

	this.r;
	this.minR;
	this.maxR;
	this.angle = 45;
	this.shotList = [];

	//move things here
	this.move = function (){

		if(this.shotList.length == 0 && gameTimer % this.reloadTime == 0)
		{
			let collidedEnemy = this.collisionCheckWithAllEnemy();

			if(collidedEnemy !== false)
			{
				this.angle = getAngleBetween2PointsInRadian(this.x, this.y, gameLoop.enemyList[collidedEnemy[0]].x, gameLoop.enemyList[collidedEnemy[0]].y);
				this.shoot(collidedEnemy[0]);		
			}
		}

		for (let i = this.shotList.length - 1; i >= 0; i--)
		{
			if(gameLoop.enemyList[this.shotList[i].enemyID] == undefined || gameLoop.enemyList[this.shotList[i].enemyID].isDead)
			{
				let collidedEnemy = this.collisionCheckWithAllEnemy();
				if(collidedEnemy !== false)
				{
					this.shotList[0].enemyID = collidedEnemy[0];
				}else{
					this.shotList[0].isDead = true;
				}
			}

			if (this.shotList[i].isDead){
				this.shotList.splice(i, 1);
			} else {
				this.shotList[i].angle = getAngleBetween2PointsInRadian(this.shotList[i].x, this.shotList[i].y, 
					gameLoop.enemyList[this.shotList[i].enemyID].x, gameLoop.enemyList[this.shotList[i].enemyID].y);

				this.shotList[i].x += Math.cos(this.shotList[i].angle) * this.shotList[i].speed;
				this.shotList[i].y += Math.sin(this.shotList[i].angle) * this.shotList[i].speed;
				let hasHit = this.shotCollisionCheckWithSingleEnemy(this.shotList[i])
				
				if(hasHit !== false){
					gameLoop.enemyList[this.shotList[i].enemyID].takeHit(this.shotList[i].damage);
					this.shotList[i].isDead = true;
				} else if (this.shotList[i].x > canvas.width || this.shotList[i].x < 0 || this.shotList[i].y > canvas.height || this.shotList[i].y < 0){
					this.shotList[i].isDead = true;
				}
			}
		}
	}


	//draw things here
	this.draw = function(){

		// draw the base of the tower that does not rotate
		if (this.imageBase) { // optional
		    drawBitmapCenteredWithRotation(this.imageBase, this.x + offsetX, this.y + offsetY, 0);
		}

		// draw the part that rotates
		// with a little fake AI (a wobble! =)
		var angleWobble = Math.cos(performance.now()/555)*0.25;
		drawBitmapCenteredWithRotation(this.image, this.x + offsetX, this.y + offsetY, this.angle+angleWobble);

		// draw all the missiles
		for(let i = 0; i < this.shotList.length; i++)
		{
			//colorCircle(this.shotList[i].x + offsetX, this.shotList[i].y + offsetY, this.shotList[i].r, this.shotList[i].color);
    		
    		drawBitmapCenteredWithRotation(
    		    this.imageProjectile, 
    		    this.shotList[i].x + offsetX, 
    		    this.shotList[i].y + offsetY, 
                // FIXME: the missile angle seems wrong.. need to change to radians or something maybe
    		    //this.shotList[i].r
                // cheap hack solution: copy the turret angle lol
                 this.angle+angleWobble
                 // lol the true solution is to calc the ang based on missile velocity
    		);
		}

		// we may have just fired a shot! draw some fx
		if (this.muzzleFlashAlpha>0) {
            ctx.globalAlpha = this.muzzleFlashAlpha;
            this.muzzleFlashAlpha -= 0.025; // fade out
            drawBitmapCenteredWithRotation(this.imageMuzzleFlash, this.x + offsetX, this.y + offsetY, this.angle+angleWobble);			
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

	this.shoot = function(enemyID)
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
			enemyID: enemyID,
			isDead: false
		};
		this.shotList.push(newShot);

		// add a little muzzle flash effect
		this.muzzleFlashAlpha = 1;
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
		this.image = "MissileTowerTurret";//FIXME +"L" + this.level;
		let random = Math.floor(Math.random() * Math.floor(50));

		switch(this.level){
			case 1:
				this.minR = 200;
				this.maxR = 400;
				this.shootSpeed = 3;
				this.shootColor = '#1abdd6';
				this.shootR = 8;
				this.shootDamage = 5;
				this.reloadTime = 300 + random;
				break;
			case 2:
				this.minR = 200;
				this.maxR = 500;
				this.shootSpeed = 4;
				this.shootColor = '#d323d9';
				this.shootR = 10;
				this.shootDamage = 7;
				this.reloadTime = 250 + random;
				break;
			case 3:
				this.minR = 100;
				this.maxR = 500;
				this.shootSpeed = 5;
				this.shootColor = '#db2531';
				this.shootR = 14;
				this.shootDamage = 10;
				this.reloadTime = 250 + random;
				break;
		}
	}

	this.shotCollisionCheckWithSingleEnemy = function(shot)
	{
		return collisionCheckRoundShapes(shot.x, shot.y, shot.r, gameLoop.enemyList[shot.enemyID].x, gameLoop.enemyList[shot.enemyID].y, gameLoop.enemyList[shot.enemyID].r)
	}

	this.collisionCheckWithAllEnemy = function()
	{
		let collidedEnemies = [];
		for(let i = 0; i < gameLoop.enemyList.length; i++)
		{
			//enemy to close
			if(collisionCheckRoundShapes(this.x, this.y, this.minR, gameLoop.enemyList[i].x, gameLoop.enemyList[i].y, gameLoop.enemyList[i].r))
			{
				continue;
			}
			//in area
			if(collisionCheckRoundShapes(this.x, this.y, this.maxR, gameLoop.enemyList[i].x, gameLoop.enemyList[i].y, gameLoop.enemyList[i].r))
			{
				collidedEnemies.push(i);
			}		
		}
		if(collidedEnemies.length == 0)
		{
			return false;
		}

		return collidedEnemies;
	}


}
