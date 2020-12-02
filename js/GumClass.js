
function GumClass(){
	
	this.x;
	this.y;
	this.indexX;
	this.indexY;

	this.r = 20;
	this.altar;
	this.isDead = false;
	this.hasOwner = false;

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

		
	}


	//draw things here
	this.draw = function(){
	
		drawImageWithAngle("gum1", this.x + offsetX, this.y + offsetY, 0);

	}

	this.removeOwner = function()
	{
		this.hasOwner = false;
	}

	this.addOwner = function(owner)
	{
		this.hasOwner = true;
	}

	this.isFreeToGrab = function()
	{
		if(this.hasOwner === false && this.isDead === false)
		{
			return true;
		}

		//else
		return false;
	}

	this.getKilled = function()
	{
		this.isDead = true;
	}

	this.setPosition = function(x, y)
	{
		this.x = x;
		this.y = y;
	}

	//Inititalize
	this.init = function(pathNumber)
	{
		this.x = returnPixelPosFromIndexPos(gameLoop.returnGumAltarPos(pathNumber).indexX) + TILE_SIZE / 2;
		this.y = returnPixelPosFromIndexPos(gameLoop.returnGumAltarPos(pathNumber).indexY) + TILE_SIZE / 2;
		this.indexX = gameLoop.returnGumAltarPos(pathNumber).indexX;
		this.indexY = gameLoop.returnGumAltarPos(pathNumber).indexY;
		this.altar = pathNumber;
	}

}
