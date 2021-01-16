
//Main Menu Scene Loop
mainMenu = new function(){
	
	this.buttonList = [];
	this.menuScene = 'mainMenu';
	this.mapPreviewMaXRows = 5;
	this.mapPrevievthumbWidth = 120;
	this.mapPrevievRowDist = 30;
	this.mapPrevievColDist = 10;

	//move things here
	this.move = function (){
		
	}

	//draw things here
	this.draw = function(){
		//blue #279EBC ,green #9EBC27, pink #BC279E
		colorRect(0, 0, canvas.width, canvas.height, '#3d3d3d');
		let mapListRow = 0;
		let mapListCol = 0;

		switch (this.menuScene) {
			case 'mainMenu':
				//draw buttons on mainMenu scene
				drawButtons(this.buttonList, 'mainMenuBTN');
				break;

			case 'newLevel':
				for(let i = 0; i < mapList.length; i++){
					if(i != 0 && i % this.mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}
					drawImageAtWidthSize(mapList[i].name, this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow,
										30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol, this.mapPrevievthumbWidth);
					
					colorText(mapList[i].name, this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow,
								30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol - 5, 20, '#ffffff');
					mapListRow++;
				}
				break;
			case 'editLevel':
				//draw the map preview images on the editMap scene
				for(let i = 0; i < levelList.length; i++){
					if(i != 0 && i % this.mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}
					drawImageAtWidthSize(levelList[i].mapName, this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow,
										30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol, this.mapPrevievthumbWidth);
					
					colorText(levelList[i].levelName, this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow,
								30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol - 5, 20, '#ffffff');
					mapListRow++;
				}
				break;
		}
		
		
	}

	//Inititalize things on first run, like buttons an such
	this.init = function(){

		GenerateButton(this.buttonList, 200, 200, 350, 100, '#17c0eb','New Level', 15, 15, 50, '#000000', 'newLevel', 'mainMenuBTN');
		GenerateButton(this.buttonList, 200, 320, 350, 100, '#7158e2','Edit Level', 15, 15, 50, '#000000', 'editLevel', 'mainMenuBTN');
	
	}
	
	this.onMouseClicked = function(){
		
		//Look which button was pressed if we are in the mainMenu scene
		if(this.menuScene == 'mainMenu'){
			for(let i = 0; i < this.buttonList.length; i++){
				if(mouseX > this.buttonList[i].x && mouseX < this.buttonList[i].x + this.buttonList[i].w &&
					mouseY > this.buttonList[i].y && mouseY < this.buttonList[i].y + this.buttonList[i].h){
				
					switch (this.buttonList[i].name) {
						case 'newLevel':
							this.menuScene = 'newLevel';
							return;		
						case 'editLevel':
							this.menuScene = 'editLevel';
							return;
						default:
							break;
					}
				}
			}
		
		//Look which map was selected if we are in the newLevel scene and start the editor
		}else if(this.menuScene == 'newLevel'){
			let mapListRow = 0;
			let mapListCol = 0;
			for(let i = 0; i < mapList.length; i++){

				if(i != 0 && i % this.mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}

				if(mouseX > this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow && 
					mouseX < this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow + this.mapPrevievthumbWidth &&
					mouseY > 30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol &&
					mouseY < 30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol + this.mapPrevievthumbWidth - 20){
					
					levelEditor.init(mapList[i].name);
					scene = 'levelEditor';
					return;				
				}
				mapListRow++;
			}
		}else if(this.menuScene == 'editLevel'){
			let mapListRow = 0;
			let mapListCol = 0;
			for(let i = 0; i < levelList.length; i++){

				if(i != 0 && i % this.mapPreviewMaXRows == 0){ mapListCol++; mapListRow = 0;}

				if(mouseX > this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow && 
					mouseX < this.mapPrevievRowDist + (this.mapPrevievthumbWidth + this.mapPrevievRowDist) * mapListRow + this.mapPrevievthumbWidth &&
					mouseY > 30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol &&
					mouseY < 30 + this.mapPrevievColDist + (this.mapPrevievthumbWidth + this.mapPrevievColDist) * mapListCol + this.mapPrevievthumbWidth - 20){
					
					levelEditor.initEditLevel(levelList[i].levelName);
					scene = 'levelEditor';
					scene = 'levelEditor';
					return;				
				}
				mapListRow++;
			}
		}

	}

}
