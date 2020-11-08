
var debug_MODE = {
	path: false,
};

var mouseAction ={
	selected: undefined,
	action: undefined
};

//mapEditor Main Loop
mapEditor = new function(){
	
	this.toolbarHeight = 135;
	this.toolbarStartY = 600 - this.toolbarHeight; //600 is canvas height
	this.buttonList = [];
	this.mapImage;
	this.offsetAmount = 30;
	this.tileOnHand = 0;
	this.message = 'Start by adding a Path!';
	this.isMapValid = 0;
	this.pathList = []; //just stores "show data" and also functions as a "length"
	this.activePath = 0;
	this.copyMap = [];

	//move things here
	this.move = function (){
		
	}

	//draw things here
	this.draw = function(){
		//blue #279EBC ,green #9EBC27, pink #BC279E
		colorRect(0, 0, canvas.width, canvas.height, '#4b4b4b');

		//draw map
		drawImageWithAngle(this.mapImage, offsetX, offsetY, 0);
		mapGrid.draw();
		
		//draw toolbar background
		colorRect(0, this.toolbarStartY, canvas.width, this.toolbarHeight, '#3d3d3d');

		//draw text
		colorText('ROWS', 30, 25+this.toolbarStartY, 16, '#ffffff');
		colorText(mapGrid.getRows(), 40, 45+this.toolbarStartY, 16, '#ffffff');
		colorText('COLS', 30, 80+this.toolbarStartY, 16, '#ffffff');
		colorText(mapGrid.getCols(), 40, 100+this.toolbarStartY, 16, '#ffffff');

		colorText(this.message, 10, 128+this.toolbarStartY, 16, '#fcbe03');

		drawButtons(this.buttonList, 'mapEditorBTN', 'pathBTN');

	}

	//Inititalize things on first run, like buttons an such
	this.init = function(mapImage){
		this.mapImage = mapImage;


		for(let i = 0; i < 8; i++){
			this.addNewPath();
		}
	
		this.setActivePath(0);
		this.message = 'Start by adding a Path!';

		GenerateButton(this.buttonList, 10, 30+this.toolbarStartY, 20, 20, '#17c0eb','-', 4, -3, 20, '#000000', 'subRowBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 70, 30+this.toolbarStartY, 20, 20, '#17c0eb','+', 4, -3, 20, '#000000', 'addRowBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 10, 85+this.toolbarStartY, 20, 20, '#17c0eb','-', 4, -3, 20, '#000000', 'subColBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 70, 85+this.toolbarStartY, 20, 20, '#17c0eb','+', 4, -3, 20, '#000000', 'addColBTN', 'mapEditorBTN');

		//GenerateButton(this.buttonList, 105, 10+this.toolbarStartY, 95, 30, '#ffb8b8','Add Path', 5, 3, 18, '#000000', 'addPathBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 105, 45+this.toolbarStartY, 95, 30, '#ffb8b8','Validate', 3, 3, 18, '#000000', 'validateBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 105, 80+this.toolbarStartY, 95, 30, '#ffb8b8','Save Map', 5, 3, 18, '#000000', 'saveBTN', 'mapEditorBTN');

		GenerateButton(this.buttonList, 500, 5+this.toolbarStartY, 52, 52, '#4b4b4b','Empty', 1, 15, 16, '#ffffff', 'pathEmptyBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 610, 5+this.toolbarStartY, 52, 52, '#ff9f1a','Turret', 0, 15, 15, '#000000', 'pathTurretBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 500, 60+this.toolbarStartY, 52, 52, '#32ff7e','Start', 0, 15, 18, '#000000', 'pathStartBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 555, 60+this.toolbarStartY, 52, 52, '#7d5fff','Path', 4, 15, 18, '#000000', 'pathPathBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 610, 60+this.toolbarStartY, 52, 52, '#ff4d4d','Goal', 5, 15, 18, '#000000', 'pathGoalBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, 555, 5+this.toolbarStartY, 52, 52, '#757357','Gum', 8, 15, 18, '#000000', 'pathGumBTN', 'mapEditorBTN');

		GenerateButton(this.buttonList, canvas.width - 90, 10+this.toolbarStartY, 40, 40, '#7158e2','⬆️', 0, 0, 30, '#ffffff', 'upBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, canvas.width - 50, 40+this.toolbarStartY, 40, 40, '#7158e2','➡️', 0, 0,30, '#ffffff', 'rightBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, canvas.width - 130, 40+this.toolbarStartY, 40, 40, '#7158e2','⬅️', 0, 0, 30, '#ffffff', 'leftBTN', 'mapEditorBTN');
		GenerateButton(this.buttonList, canvas.width - 90, 70+this.toolbarStartY, 40, 40, '#7158e2','⬇️', 0, 0, 30, '#ffffff', 'downBTN', 'mapEditorBTN');


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

					}else if(this.buttonList[i].group == 'mapEditorBTN'){
					
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
