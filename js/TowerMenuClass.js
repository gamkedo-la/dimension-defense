
function TowerMenuClass(){
	
	this.x;
	this.y;
	this.indexX;
	this.indexY;

	this.w = 100;
	this.h;

	this.isActive = false, 
	this.boxColor = "red";
	this.btnH = 20;
	this.btnColor = "green";
	this.btnTxtSize = 14;
	this.menuScale;
	this.towerList = [
		"gunTower",
		"slowdownTower"
	]
	this.btnList = [];


	this.openNewTowerMenu = function(atIndexX, atIndexY)
	{
		this.isActive = true;
		this.x = returnPixelPosFromIndexPos(atIndexX) - this.newTowerMenu.w;
		this.y = returnPixelPosFromIndexPos(atIndexY);
		this.indexX = atIndexX;
		this.indexY = atIndexY;
		this.scale = 0;
	}

	//move things here
	this.move = function (){

		if(this.isActive)
		{
			if(this.scale < 1)
			{
				this.scale = Math.round((this.scale + 0.1) * 10) / 10;
			}
		}
		
	}


	//draw things here
	this.draw = function(){
		if(this.isActive)
		{
			colorRect(this.x, this.y, this.w * this.scale, this.h * this.scale, "white");
			colorText("Gun Tower", this.x, this.y + 20, 20, "black");
		}

	}

	//Inititalize
	this.init = function(indexX, indexY)
	{
		for(let i = 0; i < this.towerList; i++)
		{
			this.btnList[i] = 
			{
				tower: this.towerList[i],
				y: this.btnH * i,
				scale: 0
			}
		}



	}

}
