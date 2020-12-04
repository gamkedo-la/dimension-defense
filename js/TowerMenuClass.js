
function TowerMenuClass(){
	
	this.x;
	this.y;
	this.indexX;
	this.indexY;

	this.w = 180;	
	this.h;
	this.paddingX = 5;
	this.paddingY = 20;

	this.isActive = false;
	this.closeMenu = false;
	this.boxColor = "#474747";

	this.btnH = 30;
	this.bthnHoverColor = "#8E989E"
	this.btnTxtSize = 18;
	this.btnTxtColor = "#D3E2EB";
	this.hoveredBtn = false;
	this.menuScale;
	this.btnList = [];

	this.towerList = [
		"gunTower",
		"slowdownTower"
	]
	

	//move things here
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


	//draw things here
	this.draw = function(){
		//console.log(this.x)
		colorRectWithAlpha(this.x + offsetX, this.y + offsetY, this.w * this.scale, this.h * this.scale, this.boxColor, 0.8);

		if(!this.closeMenu){
			for(let i = 0; i < this.btnList.length; i++)
			{
				if(i === this.hoveredBtn)
				{
					colorRectWithAlpha(this.x + offsetX,this.y + this.btnList[i].y + offsetY, this.w, this.btnH, this.bthnHoverColor, 0.8);
				}

				colorText(this.btnList[i].txt, this.x + offsetX, this.y + this.btnList[i].y + offsetY + this.btnTxtSize, this.btnTxtSize, this.btnTxtColor);

			}
		}
	}

	this.openNewTowerMenu = function(atIndexX, atIndexY)
	{
		this.isActive = true;
		this.x = returnPixelPosFromIndexPos(atIndexX);
		this.y = returnPixelPosFromIndexPos(atIndexY);
		this.indexX = atIndexX;
		this.indexY = atIndexY;
		this.scale = 0;
		this.closeMenu = false;

		this.chooseOpeningside();
	}

	this.mouseClicked = function()
	{
		if(this.hoveredBtn !== false)
		{
			gameLoop.spawnTower(this.indexX, this.indexY, this.towerList[this.hoveredBtn]);
		}

		this.closeMenu = true;

	}

	this.checkMouseHover = function()
	{
		
		if(mouseX > this.x && mouseX < this.x + this.w
			&& mouseY > this.y && mouseY < this.y + this.h)
		{
			
			for(let i = 0; i < this.btnList.length; i++)
			{
				if(mouseY > this.y + this.btnList[i].y && mouseY < this.y + this.btnList[i].y + this.btnH)
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

		if (TILE_SIZE + this.x + this.w + offsetX + this.paddingX< canvas.width - offsetX) {
			this.x += TILE_SIZE + this.paddingX;
		}else{
			this.x -= this.w + this.paddingX;
		}

		if (this.y + this.h + offsetX + this.paddingY < canvas.height - offsetX) {
			this.y += this.paddingY;
		}else{
			this.y -= this.h + this.paddingY - TILE_SIZE;
		}
	}

	this.init = function()
	{
		for(let i = 0; i < this.towerList.length; i++)
		{
			this.btnList[i] = 
			{
				tower: this.towerList[i],
				y: this.btnH * i,
				txt: 0
			}

			switch(this.towerList[i]){
				case "gunTower":
					this.btnList[i].txt = "Gun Tower";
					break;
				case "slowdownTower":
					this.btnList[i].txt = "Slowdown Tower";
					break;

			}
		
		}
		this.h = this.btnH * this.towerList.length;

	}

}
