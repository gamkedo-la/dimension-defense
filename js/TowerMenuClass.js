
function TowerMenuClass(){
	
	this.x;
	this.y;
	this.indexX;
	this.indexY;

	this.w = 200;	
	this.h;
	this.paddingX = 5;
	this.paddingY = 20;

	this.isActive = false;
	this.closeMenu = false;
	this.isUpgradeMenu;
	this.towerIndex;

	this.boxColor = "#474747";
	this.btnH = 30;
	this.bthnHoverColor = "#303030"
	this.btnTxtSize = 20;
	this.btnTxtNoMoneyColor = "#cc1e1e";
	this.btnTxtColor = "#c2c2c2";
	this.hoveredBtn = false;
	this.menuScale;
	this.btnList = [];

	this.towerList = [
		"gunTower",
		"slowdownTower",
		"missleTower",
		"electroTower"
	]
	
	this.move = function (){
		
		if(this.scale < 1 && !this.closeMenu)
		{
			this.scale = Math.round((this.scale + 0.1) * 10) / 10;
		}

		if(this.closeMenu)
		{
			if(this.scale > 0)
			{
				this.scale = Math.round((this.scale - 0.1) * 10) / 10;
			}else{
				this.isActive = false;
			}
		}
		
	}

	this.draw = function(){
		
		colorRectWithAlpha(this.x, this.y, this.w * this.scale, this.h * this.scale, this.boxColor, 0.8);

		if(!this.closeMenu){
			for(let i = 0; i < this.btnList.length; i++)
			{
				if(i === this.hoveredBtn)
				{
					colorRectWithAlpha(this.x ,this.y + this.btnList[i].y, this.w, this.btnH, this.bthnHoverColor, 0.9);
				}

				if(this.isUpgradeMenu)
				{
					//Upgrade Menu
					if(gameLoop.coins - this.btnList[i].price < 0 || this.btnList[i].type == 'sell')
					{
						colorText(this.btnList[i].price + "$", this.x  + 2, this.y + this.btnList[i].y + this.btnTxtSize, this.btnTxtSize, this.btnTxtNoMoneyColor);
						colorText(this.btnList[i].txt, this.x  + 50, this.y + this.btnList[i].y + this.btnTxtSize, this.btnTxtSize, this.btnTxtNoMoneyColor);
					}else{
						colorText(this.btnList[i].price + "$", this.x + 2, this.y + this.btnList[i].y + this.btnTxtSize, this.btnTxtSize, this.btnTxtColor);
						colorText(this.btnList[i].txt, this.x + 50, this.y + this.btnList[i].y + this.btnTxtSize, this.btnTxtSize, this.btnTxtColor);
					}
					
				}else{
					//New tower menu
					if(gameLoop.coins - this.btnList[i].price < 0)
					{
						colorText(this.btnList[i].price  + "$", this.x + 2, this.y + this.btnList[i].y  + this.btnTxtSize, this.btnTxtSize, this.btnTxtNoMoneyColor);
						colorText(this.btnList[i].txt, this.x + 50, this.y + this.btnList[i].y + this.btnTxtSize, this.btnTxtSize, this.btnTxtNoMoneyColor);
					}else{
						colorText(this.btnList[i].price  + "$", this.x + 2, this.y + this.btnList[i].y  + this.btnTxtSize, this.btnTxtSize, this.btnTxtColor);
						colorText(this.btnList[i].txt, this.x  + 50, this.y + this.btnList[i].y + this.btnTxtSize, this.btnTxtSize, this.btnTxtColor);
					}
				
				}
				
			}
		}
	}

	this.openNewTowerMenu = function(atIndexX, atIndexY)
	{
		this.btnList = [];
		this.isUpgradeMenu = false;

		for(let i = 0; i < this.towerList.length; i++)
		{
			this.btnList[i] = 
			{
				tower: this.towerList[i],
				y: this.btnH * i,
				price: 0,
				txt: 0
			}

			switch(this.towerList[i]){
				case "gunTower":
					this.btnList[i].txt = "Gun Tower";
					this.btnList[i].price = gameLoop.getPriceNewTower(this.towerList[i]);
					break;
				case "slowdownTower":
					this.btnList[i].txt = "Slowdown Tower";
					this.btnList[i].price =  gameLoop.getPriceNewTower(this.towerList[i]);
					break;
				case "missleTower":
					this.btnList[i].txt = "Missle Tower";
					this.btnList[i].price =  gameLoop.getPriceNewTower(this.towerList[i]);
					break;
				case "electroTower":
					this.btnList[i].txt = "Electro Tower";
					this.btnList[i].price =  gameLoop.getPriceNewTower(this.towerList[i]);
					break;
			}
		
		}
		
		//keep this for last
		this.init(atIndexX, atIndexY)
	}

	this.upgradeTowerMenu = function(towerIndex, atIndexX, atIndexY)
	{
		this.btnList = [];
		this.towerIndex = towerIndex;
		this.isUpgradeMenu = true;

		let sellprice = gameLoop.getPriceNewTower(gameLoop.towerList[towerIndex].tower);
		for(let i = 0; i < gameLoop.towerList[towerIndex].level - 1; i++)
		{
			sellprice += gameLoop.towerList[towerIndex].price[i];
			
		}
		sellprice = sellprice/2;

		if(gameLoop.towerList[towerIndex].isUpgradeable())
		{
			this.btnList[0] = 
			{ 
				type: "upgrade",
				y: this.btnH * 0,
				txt: "Upgrade Tower",
				price: gameLoop.towerList[towerIndex].getUpgradePrice()
			}
			this.btnList[1] = 
			{
				type: "sell",
				y: this.btnH * 1,
				txt: "-- Sell Tower --",
				price: sellprice
			}		
		}else{
			this.btnList[0] = 
			{
				type: "sell",
				y: this.btnH * 0,
				txt: "--Sell Tower--",
				price: sellprice
			}	
		}

		//keep this for last
		this.init(atIndexX, atIndexY)
	}

	this.mouseClicked = function()
	{
		let dontCloseMenu = false;
		if(this.hoveredBtn !== false)
		{
			if(this.isUpgradeMenu)
			{
				//Upgrade Tower event
				switch(this.btnList[this.hoveredBtn].type)
				{
					case 'upgrade':
						if(gameLoop.coins - gameLoop.towerList[this.towerIndex].getUpgradePrice() >= 0)
						{
							//Keep this order!
							gameLoop.removeCoins(gameLoop.towerList[this.towerIndex].getUpgradePrice())
							gameLoop.towerList[this.towerIndex].upgrade();				
						}else{
							dontCloseMenu = true;
						}						
						break;
					case 'sell':
						gameLoop.sellTower(this.towerIndex, this.btnList[this.hoveredBtn].price);
						break;
				}

			}else{
				//New Tower event
				if(gameLoop.coins - gameLoop.getPriceNewTower(this.btnList[this.hoveredBtn].tower) >= 0)
				{
					gameLoop.spawnTower(this.indexX, this.indexY, this.towerList[this.hoveredBtn]);
					gameLoop.removeCoins(this.btnList[this.hoveredBtn].price);
				}else{
					dontCloseMenu = true;
				}
				
			}
		}
		
		if(!dontCloseMenu)
		{
			this.closeMenu = true;
		}
	}

	this.checkMouseHover = function()
	{
		let msX = mouseX - offsetX;
		let msY = mouseY - offsetY;
		
		if(msX > this.x && msX < this.x + this.w
			&& msY > this.y && msY < this.y + this.h)
		{
			
			for(let i = 0; i < this.btnList.length; i++)
			{
				if(msY > this.y + this.btnList[i].y && msY < this.y + this.btnList[i].y + this.btnH)
				{
					this.hoveredBtn = i;
					return;
				}
			}	

		}else{
			this.hoveredBtn = false;
		}
	}
	
	this.chooseOpeningside = function()
	{	
		if (this.x + TILE_SIZE + this.paddingX + this.w < canvas.width - offsetX) {
			this.x += TILE_SIZE + this.paddingX;
		}else{
			this.x -= this.w + this.paddingX;
		}

		if (this.y + this.h + this.paddingY < canvas.height - offsetX) {
			this.y += this.paddingY;
		}else{
			this.y -= this.h + this.paddingY - TILE_SIZE;
		}
	}

	this.init = function(atIndexX, atIndexY)
	{
		this.isActive = true;
		this.x = returnPixelPosFromIndexPos(atIndexX);
		this.y = returnPixelPosFromIndexPos(atIndexY);
		this.indexX = atIndexX;
		this.indexY = atIndexY;
		this.scale = 0;
		this.closeMenu = false;
		this.h = this.btnH * this.btnList.length;

		this.chooseOpeningside();
	}

}
