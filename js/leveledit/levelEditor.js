
var debug_MODE = {
	path: false,
};

var mouseAction ={
	selected: undefined,
	action: undefined
};

//mapEditor Main Loop
levelEditor = new function(){
	
	this.lvlName = "LevelName";
	this.toolbarHeight = 135;
	this.toolbarStartY = 735 - this.toolbarHeight; //600 is canvas height
	this.buttonList = [];
	this.mapImage;
	this.offsetAmount = 30;
	this.message = 'Start by adding a Path!';
	this.isMapValid = 0;
	this.pathList = []; //just stores "show data" and also functions as a "length"
	this.activePath = 0;
	this.copyMap = [];
	this.currentWave = 0;

	//move things here
	this.move = function (){
		
	}

	//draw things here
	this.draw = function(){
		//blue #279EBC ,green #9EBC27, pink #BC279E
		colorRect(0, 0, canvas.width, canvas.height, '#4b4b4b');

		//draw map
		drawImageWithAngle(this.mapImage, offsetX, offsetY, 0);
	//	mapGrid.draw();
		
		//draw toolbar background
		colorRect(0, this.toolbarStartY, canvas.width, this.toolbarHeight, '#3d3d3d');

		//draw text
		colorText('Start Offset', 5, 45+this.toolbarStartY, 16, '#ffffff');
		colorText('X', 53, 70+this.toolbarStartY, 20, '#ffffff');
		colorText('Y', 53, 100+this.toolbarStartY, 20, '#ffffff');

		colorText('GumAltar', 130, 18+this.toolbarStartY, 16, '#ffffff');
		colorText(this.currentWave + 1, 255, 41+this.toolbarStartY, 20, '#ffffff');

		colorText('Wave', 244, 18+this.toolbarStartY, 18, '#ffffff');
		colorText(this.currentWave + 1, 155, 41+this.toolbarStartY, 20, '#ffffff');

		colorText('Delay', 240, 85+this.toolbarStartY, 16, '#ffffff');
		colorText('111', 250, 106+this.toolbarStartY, 20, '#ffffff');

		colorText(this.message, 10, 128+this.toolbarStartY, 16, '#fcbe03');

		drawButtons(this.buttonList, 'lvlEditorBTN', 'pathBTN');

	}

	//Inititalize things on first run, like buttons an such
	this.init = function(mapImage){
		this.mapImage = mapImage;


	/*	for(let i = 0; i < 8; i++){
			this.addNewPath();
		}
	
		this.setActivePath(0);

		*/
		this.message = 'Start by adding a Path!';

		GenerateButton(this.buttonList, 5, 5+this.toolbarStartY, 115, 20, '#17c0eb',this.lvlName, 4, -2, 16, '#000000', 'lvlNameBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 25, 55+this.toolbarStartY, 15, 20, '#17c0eb','-', 2, -4, 20, '#000000', 'subOffXBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 75, 55+this.toolbarStartY, 15, 20, '#17c0eb','+', 2, -1, 16, '#000000', 'addOffXBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 3, 55+this.toolbarStartY, 20, 20, '#17c0eb','--', 1, 0, 14, '#000000', 'subsubOffXBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 92, 55+this.toolbarStartY, 22, 20, '#17c0eb','++', 1, -2, 18, '#000000', 'addaddOffXBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 25, 85+this.toolbarStartY, 15, 20, '#17c0eb','-', 2, -4, 20, '#000000', 'subOffYBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 75, 85+this.toolbarStartY, 15, 20, '#17c0eb','+', 2, -1, 16, '#000000', 'addOffYBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 3, 85+this.toolbarStartY, 20, 20, '#17c0eb','--', 1, 0, 14, '#000000', 'subsubOffYBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 92, 85+this.toolbarStartY, 22, 20, '#17c0eb','++', 1, -2, 18, '#000000', 'addaddOffYBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 135, 25+this.toolbarStartY, 15, 20, '#17c0eb','<', 3, -2, 18, '#000000', 'backGumaltarBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 185, 25+this.toolbarStartY, 15, 20, '#17c0eb','>', 3, -2, 18, '#000000', 'forwGumaltarBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 230, 50+this.toolbarStartY, 35, 20, '#ff4d4d','DEL', 1, -2, 18, '#000000', 'addWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 270, 50+this.toolbarStartY, 35, 20, '#32ff7e','ADD', 2, -2, 18, '#000000', 'delWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 235, 25+this.toolbarStartY, 15, 20, '#17c0eb','<', 3, -2, 18, '#000000', 'backWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 285, 25+this.toolbarStartY, 15, 20, '#17c0eb','>', 3, -2, 18, '#000000', 'forwWaveBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 230, 90+this.toolbarStartY, 15, 20, '#17c0eb','-', 2, -4, 20, '#000000', 'subStartDelayBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 290, 90+this.toolbarStartY, 15, 20, '#17c0eb','+', 2, -1, 16, '#000000', 'addStartDelayBTN', 'lvlEditorBTN');

		//GenerateButton(this.buttonList, 105, 10+this.toolbarStartY, 95, 30, '#ffb8b8','Add Path', 5, 3, 18, '#000000', 'addPathBTN', 'lvlEditorBTN');
		//GenerateButton(this.buttonList, 105, 45+this.toolbarStartY, 95, 30, '#ffb8b8','Validate', 3, 3, 18, '#000000', 'validateBTN', 'lvlEditorBTN');
		//GenerateButton(this.buttonList, 105, 80+this.toolbarStartY, 95, 30, '#ffb8b8','Save Map', 5, 3, 18, '#000000', 'saveBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 500, 5+this.toolbarStartY, 52, 52, '#4b4b4b','Empty', 1, 15, 16, '#ffffff', 'pathEmptyBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 610, 5+this.toolbarStartY, 52, 52, '#ff9f1a','Tower', 0, 15, 15, '#000000', 'pathTurretBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 500, 60+this.toolbarStartY, 52, 52, '#32ff7e','Start', 0, 15, 18, '#000000', 'pathStartBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 555, 60+this.toolbarStartY, 52, 52, '#7d5fff','Path', 4, 15, 18, '#000000', 'pathPathBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 610, 60+this.toolbarStartY, 52, 52, '#ff4d4d','Goal', 5, 15, 18, '#000000', 'pathGoalBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 555, 5+this.toolbarStartY, 52, 52, '#757357','Gum', 8, 15, 18, '#000000', 'pathGumBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, canvas.width - 90, 10+this.toolbarStartY, 40, 40, '#7158e2','⬆️', 0, 0, 30, '#ffffff', 'upBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, canvas.width - 50, 40+this.toolbarStartY, 40, 40, '#7158e2','➡️', 0, 0,30, '#ffffff', 'rightBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, canvas.width - 130, 40+this.toolbarStartY, 40, 40, '#7158e2','⬅️', 0, 0, 30, '#ffffff', 'leftBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, canvas.width - 90, 70+this.toolbarStartY, 40, 40, '#7158e2','⬇️', 0, 0, 30, '#ffffff', 'downBTN', 'lvlEditorBTN');


	}

	this.setActivePath = function(activePath){
		this.activePath = activePath;
		for(let i = 0; i < this.pathList.length; i++){
			if(i == this.activePath){
				ChangeButtonAttribute(this.buttonList, 'pathActive' + i, 'bc', '#32ff7e')
			}else{
				ChangeButtonAttribute(this.buttonList, 'pathActive' + i, 'bc', '#17c0eb')
			}
		}
		this.message = "Path " + activePath + " selected to edit.";
	}

	this.setShowPath = function(showPath){
		if(this.pathList[showPath] == 1){
			this.pathList[showPath] = 0;
			ChangeButtonAttribute(this.buttonList, 'pathShow' + showPath, 'txt', '👁️');
		}else{
			this.pathList[showPath] = 1;
			ChangeButtonAttribute(this.buttonList, 'pathShow' + showPath, 'txt', '🙈');
		}
	}


	this.deletePath = function(showPath){
		this.pathList[showPath].splice(i, 1);
		
	}

	this.addNewPath = function(){	
		if(this.pathList.length == 8){
			console.log("cant add more paths.");
			return;
		}
		
		this.pathList.push(1);
		
		let pathPlace = this.pathList.length - 1; //should have named this PathIndex tbh....
		let pathPlaceX = 1 * (pathPlace / 4 >= 1);
		let pathPlaceY = pathPlace % 4;
		
		GenerateButton(this.buttonList, 145 * pathPlaceX + 210, 26 * pathPlaceY + 10+this.toolbarStartY, 20, 20, '#ff4d4d','💀', 0, 0, 16, '#000000','pathDelete' + pathPlace, 'pathBTN');
		GenerateButton(this.buttonList, 145 * pathPlaceX + 235, 26 * pathPlaceY + 10+this.toolbarStartY, 80, 20, '#32ff7e','Path ' + pathPlace, 4, -3, 20, '#000000','pathActive' + pathPlace, 'pathBTN');
		GenerateButton(this.buttonList, 145 * pathPlaceX + 320, 26 * pathPlaceY + 10+this.toolbarStartY, 20, 20, '#17c0eb','🙈', -1, -1, 16, '#000000','pathShow' + pathPlace, 'pathBTN');
	}

	this.validateMap = function(){
		let mapData = [];
		for(let i = 0; i < this.pathList.length; i++){
			mapData[i] = {};
			let pathExists = false;
			let turretPositions = [];
			let goalPositions = [];
			let startPositions = [];
			let gumPositions = [];
			let mapCheck = mapGrid.returnMap(i);
			for(let x = 0; x < mapCheck.length; x++){
				for(let y = 0; y < mapCheck[0].length; y++){
					if(mapCheck[x][y] == 1){
						startPositions.push({x: x, y: y});
					}else if(mapCheck[x][y] == 2){
						pathExists = true;
					}else if(mapCheck[x][y] == 3){
						goalPositions.push({x: x, y: y});
					}else if(mapCheck[x][y] == 4){
						turretPositions.push({x: x, y: y});
					}else if(mapCheck[x][y] == 5){
						gumPositions.push({x: x, y: y});
					}
				}
			}

			if(startPositions.length > 1){
				this.message = "Validation error: Path " + i + " has more than 1 start position.";
				return;
			}else if(startPositions.length == 1 && pathExists == false){
				this.message = "Validation error: Path " + i + " has a starting point but no path set.";
				return;
			}else if(goalPositions.length > 1){
				this.message = "Validation error: Path " + i + " has more than 1 goal position.";
				return;
			}else if(goalPositions.length == 1 && pathExists == false){
				this.message = "Validation error: Path " + i + " has a goal point but no path set.";
				return;
			}else if(pathExists && (startPositions.length == 0 || goalPositions.length == 0)){
				this.message = "Validation error: Path " + i + " has a path but no goal or start position.";
				return;
			}else if((pathExists || startPositions.length > 0 || goalPositions.length > 0) && gumPositions.length == 0){
				this.message = "Validation error: Path " + i + " has a no gum spawn Point.";
				return;
			}

			if(!pathExists && turretPositions.length == 0)
			{
				mapData[i] = false;
				continue;
			}

			if(pathExists){
				//check from start to goal
				let testPath = findPath(mapCheck, startPositions[0],  goalPositions[0]);
				if(testPath == false){
					this.message = "Validation error: Path " + i + " has no valide path from start to goal.";
					return;
				}

				//check from start to gum
				for (let g = 0; g < gumPositions.length; g++){
					//check from start to gum
					let testPathSG = findPath(mapCheck, startPositions[0],  gumPositions[g]);
					if(testPathSG == false){
						this.message = "Validation error: Path " + i + " has no valide path from start to gum.";
						return;
					}

					//check from gum to goal
					let testPathGG = findPath(mapCheck, gumPositions[g],  goalPositions[0]);
					if(testPathGG == false){
						this.message = "Validation error: Path " + i + " has no valide path from gum to goal.";
						return;
					}
				}
			//	mapData[i]['pathStart'] = startPositions[0];
			//	mapData[i]['pathGoal'] = goalPositions[0];
			//	mapData[i]['pathGum'] = gumPositions[0];

			}

		/*	if(!pathExists && turretPositions.length > 0){

				mapData[i]['turretPos'] = []
				for(let j = 0; j < turretPositions.length; j++){
					mapData[i]['turretPos'][i] = turretPositions[j];
				}

				mapData[i]['pathStart'] = false;
				mapData[i]['pathGoal'] = false;
				mapData[i]['pathGum'] = false;	
			}

			mapData[i]['rows'] = mapGrid.getRows();
			mapData[i]['cols'] = mapGrid.getCols();
		*/

			mapData[i] = mapGrid.returnMap(i);
		}
		mapData['mapName'] = this.mapImage;
		mapData['rows'] = mapGrid.getRows();
		mapData['cols'] = mapGrid.getCols();

		this.copyMap[0] = {
			name: this.mapImage,
			rows: mapGrid.getRows(),
			cols: mapGrid.getCols(),
			map: mapData,
		
		};
		//this.copyMap['test'] = "lol";
		this.isMapValid = 1;
		this.message = "Map is Valid!";
	}

	this.saveMap = function(){
		if(this.isMapValid == 1){
			copyToClipboard(this.copyMap[0]);
			console.log(this.copyMap[0])
			this.message = "Save data was copied to your clipboard, please insert into mapList.js";
		}else{
			this.message = "Map is not Valid, cant save.";
		}
	}


	this.resetValidation = function(){
		this.isMapValid = 0;
	}

	this.onMouseClicked = function(){
		//var mouseIDX = pixeltoindex(mouseX);
		//var mouseIDY = pixeltoindex(mouseY);
		if(mouseY < this.toolbarStartY){
			mapGrid.placeTile(this.activePath, this.tileOnHand);
			
		}else{
			for(let i = 0; i < this.buttonList.length; i++){
				if(mouseX > this.buttonList[i].x && mouseX < this.buttonList[i].x + this.buttonList[i].w &&
					mouseY > this.buttonList[i].y && mouseY < this.buttonList[i].y + this.buttonList[i].h){
					
					if(this.buttonList[i].group == 'pathBTN'){
						for(let j = 0; j < this.pathList.length; j++){
							if(this.buttonList[i].name == 'pathActive' + j){
								this.setActivePath(j);
								return;
							}else if(this.buttonList[i].name == 'pathShow' + j){
								this.setShowPath(j);
								mapGrid.showPathSwitch(j);
								return;
							}else if(this.buttonList[i].name == 'pathDelete' + j){
								mapGrid.deletePath(j);
								this.message = "Path " + j + " deleted."
								return;
							}
						}

					}else if(this.buttonList[i].group == 'lvlEditorBTN'){
					
						switch (this.buttonList[i].name) {
							case 'upBTN':
								offsetY += this.offsetAmount;
								return;
							case 'downBTN':
								offsetY -= this.offsetAmount;
								return;
							case 'leftBTN':
								offsetX -= this.offsetAmount;
								return;
							case 'rightBTN':
								offsetX += this.offsetAmount;
								return;
							case 'addRowBTN':
								mapGrid.changeGridSize('row', 1);
								this.message = 'Added 1 row to the Grid.';
								return;
							case 'subRowBTN':
								mapGrid.changeGridSize('row', -1);
								this.message = 'Removed 1 row from the Grid.';
								return;
							case 'addColBTN':
								mapGrid.changeGridSize('col', 1);
								this.message = 'Added 1 column to the Grid.';
								return;
							case 'subColBTN':
								mapGrid.changeGridSize('col', -1);
								this.message = 'Removed 1 column from the Grid.';
								return;
							case 'addPathBTN':
								this.addNewPath();
								return;
							case 'pathEmptyBTN':
								this.tileOnHand = 0;
								this.message = 'Path removal block selected.'
								return;
							case 'pathStartBTN':
								this.tileOnHand = 1;
								this.message = 'Enemy Start block selected.'
								return;
							case 'pathPathBTN':
								this.tileOnHand = 2;
								this.message = 'Path block selected.'
								return;
							case 'pathGoalBTN':
								this.tileOnHand = 3;
								this.message = 'Enemy Goal block selected.'
								return;		
							case 'pathTurretBTN':
								this.tileOnHand = 4;
								this.message = 'Player turret spawn block selected'
								return;
							case 'pathGumBTN':
								this.tileOnHand = 5;
								this.message = 'Gum spawn block selected'
								return;
							case 'validateBTN':
								this.message = 'validating map.....'
								this.validateMap();	
								return;
							case 'saveBTN':
								this.saveMap();	
								return;
						}
					}
				}
			}
		}
	}
}
