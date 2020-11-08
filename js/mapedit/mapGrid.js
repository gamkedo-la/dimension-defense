const TILE_SIZE = 48; //square pixel size

var mapGrid = [];
mapGrid = new function(){

	//map Legend:
	// 0 = empty
	// 1 = Enemy Start spawn point
	// 2 = Enemy path way
	// 3 = Enemy Goal
	// 4 = player turret spawn Point
	// 5 = Gum Altar


	this.rows = 7;
	this.cols = 5;
	this.PathAmount = 8;
	this.mapGrid = [];
	this.showGrids = [];

	this.draw = function(){
		let drawTileX = 0;
		let drawTileY = 0;
		for(let indexX = 0; indexX < this.rows ; indexX++) {
			for(let indexY = 0; indexY < this.cols; indexY++) {
				for(let pathAmt = 0; pathAmt < this.PathAmount; pathAmt++){
					if(this.showGrids[pathAmt]){
						switch (this.mapGrid[pathAmt][indexX][indexY]) {
							case 0:
								break;
							case 1:
								colorRectWithAlpha(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, '#32ff7e', 0.6)
								break;
							case 2:
								colorRectWithAlpha(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, '#7d5fff', 0.6)
								break;
							case 3:
								colorRectWithAlpha(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, '#ff4d4d', 0.6)
								break;
							case 4:
								colorRectWithAlpha(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, '#ff9f1a', 0.6)
								break;
							case 5:
								colorRectWithAlpha(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, '#757357', 0.8)
								break;
						}
					}
				}
				rectBorderOnly(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, 1, '#cccccc')
				drawTileY += TILE_SIZE;
			}
			drawTileX += TILE_SIZE;
			drawTileY = 0;
		}
		
	}

	this.generateNewMap = function(){
		for(let pathAmt = 0; pathAmt < this.PathAmount; pathAmt++){
			this.showGrids[pathAmt] = true;
			this.mapGrid[pathAmt] = [];
			for (let posX = 0; posX < this.rows; posX++) {
				this.mapGrid[pathAmt][posX] = [];
				for (let posY = 0; posY < this.cols; posY++) {
					this.mapGrid[pathAmt][posX][posY] = 0;
				}
			}
		}
		console.log(this.mapGrid)
		return true;
	}

	this.generateEditMap = function(mapIndex){
		this.mapGrid = mapList[mapIndex].map;
		this.rows = mapList[mapIndex].rows;
		this.cols = mapList[mapIndex].cols;

		for(let pathAmt = 0; pathAmt < this.PathAmount; pathAmt++){
			this.showGrids[pathAmt] = true;
			if(this.mapGrid[pathAmt] == false)
			{
				this.mapGrid[pathAmt] = [];
				for (let posX = 0; posX < this.rows; posX++) {
					this.mapGrid[pathAmt][posX] = [];
					for (let posY = 0; posY < this.cols; posY++) {
						this.mapGrid[pathAmt][posX][posY] = 0;
					}
				}
			}
		}
		return true;
	}

	this.onMapGridChanged = function(deletePath){
		//Adjusts the array to the number of rows and cols
		//Also adds and removes paths
		//literally does anything except cake
		let tempGrid = [];
		for(let pathAmt = 0; pathAmt < this.PathAmount; pathAmt++){
			tempGrid[pathAmt] = [];
			for (let posX = 0; posX < this.rows; posX++) {
					tempGrid[pathAmt][posX] = [];		
				for (let posY = 0; posY < this.cols; posY++) {
					if(deletePath != undefined && deletePath == pathAmt){
						tempGrid[pathAmt][posX][posY] = 0;
					}else{
						if(pathAmt >= this.mapGrid.length || posX >= this.mapGrid[0].length || posY >= this.mapGrid[0][0].length){
							tempGrid[pathAmt][posX][posY] = 0;	
						}else{
							tempGrid[pathAmt][posX][posY] = this.mapGrid[pathAmt][posX][posY];
						}
					}
				}
			}
		}
		this.mapGrid = JSON.parse(JSON.stringify(tempGrid));
		mapEditor.resetValidation();
	}

	this.placeTile = function(path, tileNumber){
		this.mapGrid[path][pixelToIndex(mouseX - offsetX)][pixelToIndex(mouseY - offsetY)] = tileNumber;
		mapEditor.resetValidation();
	}

	this.deletePath = function(path){
		this.onMapGridChanged(path);
	}

	this.showPathSwitch = function(path){
		if(this.showGrids[path] == true){
			this.showGrids[path] = false;
		}else{
			this.showGrids[path] = true;
		}
	}
	
	this.addNewPath = function(){
		this.onMapGridChanged();
	}

	this.getRows = function(){
		return this.rows;
	}

	this.getCols = function(){
		return this.cols;
	}
	
	this.returnMap = function(mapIndex){
		return this.mapGrid[mapIndex];
	}

	this.changeGridSize = function(colOrRow, amount){
		if(colOrRow == 'row'){
			if(this.rows + amount > 0){
				this.rows += amount;
				this.onMapGridChanged();
			}
		}else if(colOrRow == 'col'){
			if(this.cols + amount > 0){
				this.cols += amount;
				this.onMapGridChanged();
			}
		}
	}
}

//Get the Pixel coordinate of a grid index
function indexToPixel(tileIndexNumber) {
	return tileIndexNumber * TILE_SIZE;
}

//Get grid index of a Pixel coordinate
function pixelToIndex(pixelCoordinate) {
	return Math.floor(pixelCoordinate / TILE_SIZE);
}
