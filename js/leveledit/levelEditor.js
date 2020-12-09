
var offsetX = 0;
var offsetY = 0;

//mapEditor Main Loop
levelEditor = new function(){
	
	this.lvlName = "LevelName";
	this.toolbarHeight = 150;
	this.toolbarStartY = 750 - this.toolbarHeight; //750 is canvas height
	this.buttonList = [];

	this.mapImage;
	this.rows;
	this.cols;
	this.map = [];
	this.pathList = [];
	this.mapTowerPos = [];
	this.mapStartPos = [];
	this.mapGoalPos = [];
	this.mapGumAltarPos = [];

	this.message;

	this.currentWave = 0;
	this.currentGumAltar = 0;

	this.levelData = [];

	//move things here
	this.move = function (){
		//this.moveMapWithMouse();	
		
	}

	//draw things here
	this.draw = function(){
		colorRect(0, 0, canvas.width, canvas.height, '#4b4b4b');

		//draw map
		drawImageWithAngle(this.mapImage, offsetX, offsetY, 0);
		
		//draw toolbar background
		colorRect(0, this.toolbarStartY, canvas.width, this.toolbarHeight, '#3d3d3d');

		//draw text
		colorText('Start Offset', 5, 45+this.toolbarStartY, 16, '#ffffff');
		colorText('X', 53, 70+this.toolbarStartY, 20, '#ffffff');
		colorText('Y', 53, 100+this.toolbarStartY, 20, '#ffffff');

		colorText('GumAltar', 130, 18+this.toolbarStartY, 16, '#ffffff');
		colorText(this.currentGumAltar + 1, 155, 41+this.toolbarStartY, 20, '#ffffff');	
		colorText('GumAmount', 130, 60+this.toolbarStartY, 16, '#ffffff');
		colorText(this.levelData.gumAmounts[this.currentGumAltar], 155, 80+this.toolbarStartY, 20, '#ffffff');

		colorText('Wave', 244, 18+this.toolbarStartY, 18, '#ffffff');
		colorText(this.currentWave+1, 255, 41+this.toolbarStartY, 20, '#ffffff');
		colorText('WaveDelay', 222, 85+this.toolbarStartY, 16, '#ffffff');
		colorText(this.levelData.waveStartDelay[this.currentWave], 250, 106+this.toolbarStartY, 20, '#ffffff');

		colorText(this.message, 10, 143+this.toolbarStartY, 16, '#fcbe03');

		drawButtons(this.buttonList, 'lvlEditorBTN', 'pathBTN','subWaveBTN'+this.currentWave);

		for(let i = 0; i < this.levelData.wave[this.currentWave].length; i++)
		{
			let x = 300 + (75 * i);
			let g = this.levelData.wave[this.currentWave][i];
			colorText('Enemy',25 + x, 14+this.toolbarStartY, 16, '#ffffff');
			drawImageScaled(enemyList[g.enemyType].LvlEditorImgName,35 + x, 13 + this.toolbarStartY, 0.7);

			colorText('Amount',25 + x, 55+this.toolbarStartY, 16, '#ffffff');
			colorText(g.amountToSpawn,45 + x, 70+this.toolbarStartY, 18, '#ffffff');

			colorText('Delay',25 + x, 85+this.toolbarStartY, 18, '#ffffff');
			colorText(g.delayBetweenSpawn,45 + x, 100+this.toolbarStartY, 18, '#ffffff');

			colorText('OnPath',25 + x, 115+this.toolbarStartY, 16, '#ffffff');
			colorText(g.spawnOnPath,45 + x, 130+this.toolbarStartY, 18, '#ffffff');
		}

	}

	this.changeLVLStartOffset = function(amount, axis){

		let startOffX = this.levelData.startOffset.x;
		let startOffY = this.levelData.startOffset.y;

		if(axis == 'x')
		{
			startOffX += amount;
		}
		
		if(axis == 'y')
		{
			startOffY += amount;
		}

		let img = image.get(this.mapImage);
		if (startOffX > 0) {
			startOffX = 0;
		}
		if (startOffX < canvas.width - img.width) {
			startOffX = canvas.width - img.width;
		}
		if (startOffY > 0) {
			startOffY = 0;
		}
		if (startOffY < canvas.height - this.toolbarHeight - img.height) {
			startOffY = canvas.height - this.toolbarHeight - img.height;
		}

		this.levelData.startOffset.x = startOffX;
		this.levelData.startOffset.y = startOffY;

		

		offsetX = startOffX;
		offsetY = startOffY;
	}

	this.selectGumaltar = function(direction){
		this.currentGumAltar += direction;

		let length = 0;
		for(i = 0; i < this.mapGumAltarPos.length; i++)
		{
			if(this.mapGumAltarPos[i] !== false)
			{
				length++;
			}
		}

		if (this.currentGumAltar < 0)
		{
			this.currentGumAltar = length - 1;
		}
		if (this.currentGumAltar >= length)
		{
			this.currentGumAltar = 0;
		}
	}

	this.changeGumAmt = function(amount){
		this.levelData.gumAmounts[this.currentGumAltar] += amount;
		if(this.levelData.gumAmounts[this.currentGumAltar] < 0)
		{
			this.levelData.gumAmounts[this.currentGumAltar] = 0;
		}
	}

	this.selectWave = function(direction){
		this.currentWave += direction;
		console.log(2)
		if (this.currentWave < 0)
		{
			this.currentWave = this.levelData.wave.length - 1;
		}
		if (this.currentWave >= this.levelData.wave.length)
		{
			this.currentWave = 0;
		}
	}

	this.selectEnemy = function(position, direction){
		position += direction;

		if (position < 0)
		{
			position = enemyList.length - 1;
		}
		if (position >= enemyList.length)
		{
			position = 0;
		}
		return position;
	}

	this.addNewWave = function(){
		this.levelData.wave.push([]);
		this.levelData.waveStartDelay.push(5);
		this.currentWave = this.levelData.wave.length - 1;
		this.levelData.wave[this.currentWave] = [];

		this.addNewSubWave();
		this.addNewSubWave();
		this.addNewSubWave();
		this.addNewSubWave();
		this.addNewSubWave();
		this.addNewSubWave();
	}

	this.addNewSubWave = function(){
		let swid = this.levelData.wave[this.currentWave].length;
		let x = 300 + (75 * swid);
		this.levelData.wave[this.currentWave][swid] = {
			enemyType: 0,
			spawnOnPath: this.pathList[0],
			amountToSpawn: 1,
			delayBetweenSpawn: 2,
		};

		GenerateButton(this.buttonList, 70+x, 20+this.toolbarStartY, 15, 15, '#ebc117','>', 3, -5, 18, '#000000', 'selectEnemyFWRD'+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 20+this.toolbarStartY, 15, 15, '#ebc117','<', 3, -5, 18, '#000000', 'selectEnemyBWRD'+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 70+x, 58+this.toolbarStartY, 15, 15, '#ebc117','+', 3, -5, 18, '#000000', 'addEnemyAmount'+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 58+this.toolbarStartY, 15, 15, '#ebc117','-', 3, -5, 18, '#000000', 'subEnemyAmount'+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 70+x, 88+this.toolbarStartY, 15, 15, '#ebc117','+', 3, -5, 18, '#000000', 'addSpawnDelay'+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 88+this.toolbarStartY, 15, 15, '#ebc117','-', 3, -5, 18, '#000000', 'subSpawnDelay'+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 70+x, 118+this.toolbarStartY, 15, 15, '#ebc117','>', 3, -5, 18, '#000000', 'selectPathFWRD'+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 118+this.toolbarStartY, 15, 15, '#ebc117','<', 3, -5, 18, '#000000', 'selectPathBWRD'+swid, 'subWaveBTN'+this.currentWave);
	}

	this.removeWave = function(){
		let tempWave = [];
		let tempdelay = [];
		if(this.levelData.wave.length > 1)
		{
			for(i = 0; i < this.levelData.wave.length; i++)
			{
				if(i != this.currentWave)
				{
					tempWave.push(this.levelData.wave[i]);
					tempdelay.push(this.levelData.waveStartDelay[i]);
				}
			}
		}

		this.levelData.wave = copyArray(tempWave);
		this.levelData.waveStartDelay = copyArray(tempdelay);
		this.selectWave(1);
	}

	this.changeWaveStartDelay = function(amount){
		this.levelData.waveStartDelay[this.currentWave] += amount;
		
		if(levelData.waveStartDelay[this.currentWave] < 0)
		{
			levelData.waveStartDelay[this.currentWave] = 0;
		}
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

	//Inititalize things on first run, like buttons an such
	this.init = function(mapImage){
		this.mapImage = mapImage;

		for (let i = 0; i < mapList.length; i++)
		{
			if(this.mapImage == mapList[i].name)
			{
				this.generateMapVarsFromEditorMapList(mapList[i]);
				break;
			}
		}
		this.message = 'Start by renaming the level and changing the offset!';

		this.levelData = 
		{
			levelName: this.lvlName,
			mapName: this.mapImage,
			waveStartDelay: [],
			gumAmounts: [],
			startOffset: {x:0, y:0},
			wave: []
		}

		for(i = 0; i < this.mapGumAltarPos.length; i++)
		{
			this.levelData.gumAmounts.push(0);
		}

		this.addNewWave();
		this.addNewWave();
		this.generateMainButtons();
	}

	this.moveMapWithMouse = function()
	{
		
        if (draggingMouse) {
            offsetX = dragMouseDX;
			offsetY = dragMouseDY;
		}
		
		let img = image.get(this.mapImage);
		if (offsetX > 0) {
			offsetX = 0;
		}
		if (offsetX < canvas.width - img.width) {
			 offsetX = canvas.width - img.width;
		}
		if (offsetY > 0) {
			offsetY = 0;
		}
		if (offsetY < canvas.height - this.toolbarHeight - img.height) {
			offsetY = canvas.height - this.toolbarHeight - img.height;
		}

	}

	this.onMouseClicked = function(){
		//var mouseIDX = pixeltoindex(mouseX);
		//var mouseIDY = pixeltoindex(mouseY);
		let mainbtns = []
		for(let i = 0; i < this.buttonList.length; i++)
		{
			if(this.buttonList[i].group == 'lvlEditorBTN')
			{
				mainbtns.push(i);
			}
		}
		for(let g = 0; g < mainbtns.length; g++)
		{
			console.log(mouseY)
			let i = mainbtns[g];
			if(mouseX > this.buttonList[i].x && mouseX < this.buttonList[i].x + this.buttonList[i].w &&
				mouseY > this.buttonList[i].y && mouseY < this.buttonList[i].y + this.buttonList[i].h)
			{
				
				switch (this.buttonList[i].name) 
				{
					case 'subOffXBTN':
						this.changeLVLStartOffset(1,'x');
						this.message = "Level start offset has been changed!";
						return;
					case 'subsubOffXBTN':
						this.changeLVLStartOffset(20,'x');
						this.message = "Level start offset has been changed!";
						return;
					case 'addOffXBTN':
						this.changeLVLStartOffset(-1,'x');
						this.message = "Level start offset has been changed!";
						return;
					case 'addaddOffXBTN':
						this.changeLVLStartOffset(-20,'x');
						this.message = "Level start offset has been changed!";
						return;
					case 'subOffYBTN':
						this.changeLVLStartOffset(1,'y');
						this.message = "Level start offset has been changed!";
						return;
					case 'subsubOffYBTN':
						this.changeLVLStartOffset(20,'y');
						this.message = "Level start offset has been changed!";
						return;
					case 'addOffYBTN':
						this.changeLVLStartOffset(-1,'y');
						this.message = "Level start offset has been changed!";
						return;
					case 'addaddOffYBTN':
						this.changeLVLStartOffset(-20,'y');
						this.message = "Level start offset has been changed!";
						return;
					case 'backGumaltarBTN':
						this.selectGumaltar(-1);
						this.message = "Selected Gum Altar: " + (this.currentGumAltar + 1);
						return;
					case 'forwGumaltarBTN':
						this.selectGumaltar(1);
						this.message = "Selected Gum Altar: " + (this.currentGumAltar + 1);
						return;
					case 'subGumAmtBTN':
						this.changeGumAmt(-1);
						this.message = "Gums on altar " + (this.currentGumAltar + 1) + " removed";
						return;
					case 'addGumAmtBTN':
						this.changeGumAmt(1);
						this.message = "Gums on altar " + (this.currentGumAltar + 1) + " added";
						return;
					case 'addWaveBTN':
						this.addNewWave();
						this.message = "New wave added!";
						return;
					case 'delWaveBTN':
						this.message = "Wave " + (this.currentWave + 1)+ "has been deleted.";
						this.removeWave();			
						return;
					case 'backWaveBTN':
						this.selectWave(-1);
						this.message = "Selected Wave: " + (this.currentWave + 1);
						return;
					case 'forwWaveBTN':
						this.selectWave(1);
						this.message = "Selected Wave: " + (this.currentWave + 1);
						return;
					case 'subStartDelayBTN':
						this.changeWaveStartDelay(-1)
						this.message = "Start delay for wave " + (this.currentWave + 1) + "has been changed.";
						return;		
					case 'addStartDelayBTN':
						this.changeWaveStartDelay(1)
						this.message = "Start delay for wave " +(this.currentWave + 1) + "has been changed.";
						return;
					case 'saveBTN':
						this.saveMap();	
						return;
				}
			}
		}
		
	}

	this.generateMapVarsFromEditorMapList = function(mapToProcess)
	{	
		//map Legend:
		// 0 = empty
		// 1 = Enemy Start spawn point
		// 2 = Enemy path way
		// 3 = Enemy Goal
		// 4 = player turret spawn Point
		// 5 = Gum Altar

		this.rows = mapToProcess.rows;
		this.cols = mapToProcess.cols;
		this.map = copyArray(mapToProcess.map);

		for(let i = 0; i < mapToProcess.map.length; i++)
		{
			if(mapToProcess.map[i] !== false)
			{
				for(let x =  0; x < mapToProcess.rows; x++)
				{
					for(let y = 0; y < mapToProcess.cols; y++)
					{
						switch (mapToProcess.map[i][x][y]) {
							case 0:
								break;
							case 1:
								this.mapStartPos[i] = {indexX: x, indexY: y};
								break;
							case 2:
								if(!this.pathList.includes(i)) this.pathList.push(i);								
								break;
							case 3:
								this.mapGoalPos[i] = {indexX: x, indexY: y};
								break;
							case 4:
								this.mapTowerPos.push({indexX: x, indexY: y});
								break;
							case 5:
								this.mapGumAltarPos[i] = {indexX: x, indexY: y};
								break;
						}
					}
				}
			}else{
				this.mapStartPos[i] = false;
				this.mapGoalPos[i] = false;
				this.mapGumAltarPos[i] = false;
			}
		}

		for(let i = 0; i < this.pathList.length; i++)
		{
			for(let t = 0; t < this.mapTowerPos.length; t++)
			{
				this.map[this.pathList[i]][this.mapTowerPos[t].indexX][this.mapTowerPos[t].indexY] = 4;
			} 		
		}

	}

	this.generateMainButtons = function()
	{

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
		GenerateButton(this.buttonList, 135, 65+this.toolbarStartY, 15, 20, '#17c0eb','-', 3, -2, 18, '#000000', 'subGumAmtBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 185, 65+this.toolbarStartY, 15, 20, '#17c0eb','+', 3, -2, 18, '#000000', 'addGumAmtBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 130, 90+this.toolbarStartY, 80, 20, '#ffb8b8','Save Lvl', 2, 0, 16, '#000000', 'saveBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 230, 50+this.toolbarStartY, 35, 20, '#ff4d4d','DEL', 1, -2, 18, '#000000', 'addWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 270, 50+this.toolbarStartY, 35, 20, '#32ff7e','ADD', 2, -2, 18, '#000000', 'delWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 235, 25+this.toolbarStartY, 15, 20, '#17c0eb','<', 3, -2, 18, '#000000', 'backWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 285, 25+this.toolbarStartY, 15, 20, '#17c0eb','>', 3, -2, 18, '#000000', 'forwWaveBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 230, 90+this.toolbarStartY, 15, 20, '#17c0eb','-', 2, -4, 20, '#000000', 'subStartDelayBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 290, 90+this.toolbarStartY, 15, 20, '#17c0eb','+', 2, -1, 16, '#000000', 'addStartDelayBTN', 'lvlEditorBTN');

	}
}
