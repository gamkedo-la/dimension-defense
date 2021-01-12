
function MissleTowerClass(){

	
	this.tower = "missleTower"
	this.x;
	this.y;
	this.indexX;
	this.indexY;
	this.image;

	this.image;
	this.imageBase;
	this.imageProjectile;
	this.imageMuzzleFlash = "MuzzleFlash";
	this.imageMissileTrail = "MissileTrail";
	this.muzzleFlashAlpha = 0;
	this.projectileTrails = []; // many [x,y,alpha]

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

	this.isMouseHovering = false;
	this.hoverColor = "#8730d9"
	this.hoverAlpha = 1;

	//move things here
	this.move = function (){

		if(this.shotList.length == 0 && gameTimer % this.reloadTime == 0)
		{
			let collidedEnemy = this.collisionCheckWithAllEnemy();

			if(collidedEnemy !== false)
			{
				for(let i = 0; i < collidedEnemy.length; i++)
				{
					if(!gameLoop.enemyList[collidedEnemy[i]].isDead)
					{
						this.angle = getAngleBetween2PointsInRadian(this.x, this.y, gameLoop.enemyList[collidedEnemy[i]].x, gameLoop.enemyList[collidedEnemy[i]].y);
						this.shoot(collidedEnemy[i]);
						sfxMissleTowerShoot.play();
						break;
					}
				}
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


	this.drawMissiles = function() {
		// draw all the missiles
		let x,y,a,i;
		
		// draw their smoke trails
		for(i = 0; i < this.projectileTrails.length; i++) {
            ctx.globalAlpha = this.projectileTrails[i].a;
			drawBitmapCenteredWithRotation(this.imageMissileTrail,this.projectileTrails[i].x,this.projectileTrails[i].y,this.projectileTrails[i].a*10);
			this.projectileTrails[i].a -= 0.025;
			if (this.projectileTrails[i].a<0) {
				this.projectileTrails.splice(i,1); // one less iten in array // FIXME might be GC spammy here? need to test
				i--; // so we don't skip the next index which just shifted over
			}
		}
		ctx.globalAlpha = 1; // reset

		// now draw the missiles themselves
		for(i = 0; i < this.shotList.length; i++)
		{
			x = this.shotList[i].x ;
			y = this.shotList[i].y ;
			a = this.shotList[i].angle;
            // render the missile
			drawBitmapCenteredWithRotation(this.imageProjectile,x,y,a);
			// occasionally remember smoke trail location
			if (Math.random()<0.4) this.projectileTrails.push({x:x,y:y,a:1});
		}
	}

	//draw things here
	this.draw = function(){
		if(this.isMouseHovering)
		{
			colorCircleBorderOnlyWithAlpha(this.x , this.y , this.minR , this.maxR , this.hoverColor,this.hoverAlpha);	
		}

		// draw the base of the tower that does not rotate
		if (this.imageBase) { // optional
		    drawBitmapCenteredWithRotation(this.imageBase, this.x, this.y, 0);
		}

		// draw the part that rotates
		// with a little fake AI (a wobble! =)
		let angleWobble = degreesToRadian(Math.cos(performance.now()/555)*4);
		drawBitmapCenteredWithRotation(this.image, this.x, this.y, this.angle+angleWobble);
		
        this.drawMissiles();

		// we may be have just fired a shot! draw some fx
		if (this.muzzleFlashAlpha>0) {
            ctx.globalAlpha = this.muzzleFlashAlpha;
            this.muzzleFlashAlpha -= 0.025; // fade out
            drawBitmapCenteredWithRotation(this.imageMuzzleFlash, this.x, this.y, this.angle+angleWobble);			
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
		this.image = "MissileTowerTurretL" + this.level;
		this.imageBase = "MissileTowerBaseL" + this.level;
		this.imageProjectile = "MissileL" + this.level;
		let random = Math.floor(Math.random() * Math.floor(30));

		switch(this.level){
			case 1:
				this.minR = 100;
				this.maxR = 400;
				this.shootSpeed = 3;
				this.shootColor = '#1abdd6';
				this.shootR = 8;
				this.shootDamage = 5;
				this.reloadTime = 300 + random;
				break;
			case 2:
				this.minR = 150;
				this.maxR = 500;
				this.shootSpeed = 4;
				this.shootColor = '#d323d9';
				this.shootR = 10;
				this.shootDamage = 7;
				this.reloadTime = 250 + random;
				break;
			case 3:
				this.minR = 200;
				this.maxR = 500;
				this.shootSpeed = 5;
				this.shootColor = '#db2531';
				this.shootR = 14;
				this.shootDamage = 10;
				this.reloadTime = 200 + random;
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
