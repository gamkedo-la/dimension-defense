
//Main Menu Scene Loop
gameloop = new function()
{

	this.buttonList = [];
	this.menuScene = 'mainMenu';
	this.mapPreviewMaXRows = 5;
	this.mapPrevievthumbWidth = 120;
	this.mapPrevievRowDist = 30;
	this.mapPrevievColDist = 10;


	this.init(levelMap)
	{
		


	}
	//move things here
	this.move = function (){
		
	}

	//draw things here
	this.draw = function(){
		//blue #279EBC ,green #9EBC27, pink #BC279E
		colorRect(0, 0, canvas.width, canvas.height, '#3d3d3d');

		switch (this.menuScene) {
			case 'mainMenu':
				//draw buttons on mainMenu scene
				drawButtons(this.buttonList, 'mainMenuBTN');
				break;

			case 'newMap':
				//draw the map preview images on the newMap scene
				let mapListRow = 0;
				let mapListCol = 0;
				for(let i = 0; i < image.getAllTypesOf('gameMap').length; i++){
					if(i != 0 && i % this.mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}
					drawImageAtWidthSize(image.getAllTypesOf('gameMap')[i], this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow,
										30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol, this.mapPrevievthumbWidth);
					
					colorText(image.getAllTypesOf('gameMap')[i], this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow,
								30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol - 5, 20, '#ffffff');
					mapListRow++;
				}
				break;
		}
		
		
	}

	//Inititalize things on first run, like buttons an such
	this.init = function(){

		GenerateButton(this.buttonList, 200, 150, 300, 100, '#17c0eb','New Map', 15, 15, 50, '#000000', 'newMap', 'mainMenuBTN');
		GenerateButton(this.buttonList, 200, 270, 300, 100, '#7158e2','Edit Map', 15, 15, 50, '#000000', 'editMap', 'mainMenuBTN');
	
	}
	
	this.onMouseClicked = function(){
		
		//Look which button was pressed if we are in the mainMenu scene
		if(this.menuScene == 'mainMenu'){
			for(let i = 0; i < this.buttonList.length; i++){
				if(mouseX > this.buttonList[i].x && mouseX < this.buttonList[i].x + this.buttonList[i].w &&
					mouseY > this.buttonList[i].y && mouseY < this.buttonList[i].y + this.buttonList[i].h){
				
					switch (this.buttonList[i].name) {
						case 'newMap':
							this.menuScene = 'newMap';
							return;		
						case 'editMap':
							drawButtons(this.buttonList, 'mainMenuBTN');
							return;
						default:
							break;
					}
				}
			}
		
		//Look which map was selected if we are in the newMap scene and start the mapeditor
		}else if(this.menuScene == 'newMap'){
			let mapListRow = 0;
			let mapListCol = 0;
			for(let i = 0; i < image.getAllTypesOf('gameMap').length; i++){

				if(i != 0 && i % this.mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}

				if(mouseX > this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow && 
					mouseX < this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow + this.mapPrevievthumbWidth &&
					mouseY > 30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol &&
					mouseY < 30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol + this.mapPrevievthumbWidth - 20){

					mapGrid.generateNewMap()
					mapEditor.init(true, image.getAllTypesOf('gameMap')[i]);
					scene = 'mapEditor';
					return;				
				}
				mapListRow++;
			}

		}

	}

}
