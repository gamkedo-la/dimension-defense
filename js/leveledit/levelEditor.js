
var offsetX = 0;
var offsetY = 0;
var editLvlName = false;
const TILE_SIZE = 48;

//mapEditor Main Loop
levelEditor = new function(){
	
	this.lvlName = "LevelName";
	this.toolbarHeight = 180;
	this.toolbarStartY = 780 - this.toolbarHeight; //750 is canvas height
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
	this.subWavePage = 0;

	this.highlightedPath = false;
	this.highlightedGumAltar = false;

	//move things here
	this.move = function (){
		this.moveMapWithMouse();	
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
		colorText('Coins', 140, 110+this.toolbarStartY, 16, '#ffffff');
		colorText(this.levelData.coins, 155, 130+this.toolbarStartY, 18, '#ffffff');

		colorText('Wave', 244, 18+this.toolbarStartY, 18, '#ffffff');
		colorText(this.currentWave+1, 255, 41+this.toolbarStartY, 20, '#ffffff');
		colorText('WaveDelay', 222, 85+this.toolbarStartY, 16, '#ffffff');
		colorText(this.levelData.waveStartDelay[this.currentWave], 250, 106+this.toolbarStartY, 20, '#ffffff');

		colorText(this.message, 10, 173+this.toolbarStartY, 16, '#fcbe03');

		this.highlightPath(this.highlightedPath);
		this.highlightGumAltar();

		drawButtons(this.buttonList, 'lvlEditorBTN');

		for(let i = 0; i < 6; i++)
		{
			let swid = (this.subWavePage * 6) + i;
			if(swid >= this.levelData.wave[this.currentWave].length)
			{
				return;
			}
			let x = 315 + (75 * i);
			let g = this.levelData.wave[this.currentWave][swid];
			ctx.save();
			ctx.translate(x, 0);
			drawButtonSingle(this.buttonList, 'selectEnemyFWRD'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'selectEnemyBWRD'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'addEnemyAmount'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'subEnemyAmount'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'addSpawnDelay'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'subSpawnDelay'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'selectPathFWRD'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'selectPathBWRD'+this.currentWave+"sw"+ swid);
			drawButtonSingle(this.buttonList, 'deleteEnemy'+this.currentWave+"sw"+ swid);
			
			colorText('Enemy',25, 14+this.toolbarStartY, 16, '#ffffff');
			drawImageScaled(enemyList[g.enemyType].LvlEditorImgName,35, 13 + this.toolbarStartY, 0.7);

			colorText('Amount',25, 55+this.toolbarStartY, 16, '#ffffff');
			colorText(g.amountToSpawn,45, 70+this.toolbarStartY, 18, '#ffffff');

			colorText('Delay',25, 85+this.toolbarStartY, 18, '#ffffff');
			colorText(g.delayBetweenSpawn,45, 100+this.toolbarStartY, 18, '#ffffff');

			colorText('OnPath',25, 115+this.toolbarStartY, 16, '#ffffff');
			colorText(g.spawnOnPath,45, 130+this.toolbarStartY, 18, '#ffffff');
			ctx.restore();
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
		this.switchHighlightToGumAltar();
	}

	this.changeGumAmt = function(amount){
		this.levelData.gumAmounts[this.currentGumAltar] += amount;
		if(this.levelData.gumAmounts[this.currentGumAltar] < 0)
		{
			this.levelData.gumAmounts[this.currentGumAltar] = 0;
		}
		this.switchHighlightToGumAltar();
	}

	this.changeCoinAmt = function(amount){
		this.levelData.coins += amount;
		if(this.levelData.coins < 0)
		{
			this.levelData.coins = 0;
		}
	}

	this.selectWave = function(direction){
		this.currentWave += direction;
		if (this.currentWave < 0)
		{
			this.currentWave = this.levelData.wave.length - 1;
		}
		if (this.currentWave >= this.levelData.wave.length)
		{
			this.currentWave = 0;
		}

		this.subWavePage = 0;
	}

	this.selectPage = function(direction){
		this.subWavePage += direction;
		if (this.subWavePage < 0)
		{
			this.subWavePage = Math.floor(this.levelData.wave[this.currentWave].length / 7);
		}
		if (this.subWavePage > Math.floor(this.levelData.wave[this.currentWave].length / 7))
		{
			this.subWavePage = 0;
		}
	}

	this.addNewWave = function(){
		this.levelData.wave.push([]);
		this.levelData.waveStartDelay.push(5);
		this.currentWave = this.levelData.wave.length - 1;
		this.levelData.wave[this.currentWave] = [];

		this.addNewEnemy();
	}

	this.removeWave = function(){
		if(this.levelData.wave.length > 1)
		{
			this.levelData.wave.splice(this.currentWave, 1)
		}
		this.selectWave(-1);
	}

	this.changeWaveStartDelay = function(amount){
		this.levelData.waveStartDelay[this.currentWave] += amount;
		
		if(this.levelData.waveStartDelay[this.currentWave] < 0)
		{
			this.levelData.waveStartDelay[this.currentWave] = 0;
		}
	}

	this.saveMap = function(){
		let ld = copyArray(this.levelData);

		for(let w = 0; w < ld.wave.length; w++)
		{
			for(let sw = 0; sw < ld.wave[w].length; sw++)
			{
				ld.wave[w][sw].enemyType = enemyList[this.levelData.wave[w][sw].enemyType].type;
			}
		}

		copyToClipboard(ld);
		console.log(ld)
		this.message = "Save data was copied to your clipboard, please insert into listLevels.js";
	}

	this.addNewEnemy = function(){
		let swid = this.levelData.wave[this.currentWave].length;
		let x = 0;
		this.levelData.wave[this.currentWave][swid] = {
			enemyType: 0,
			spawnOnPath: this.pathList[0],
			amountToSpawn: 1,
			delayBetweenSpawn: 2,
		};
		this.switchHighlightToPath(this.levelData.wave[this.currentWave][swid].spawnOnPath)

		GenerateButton(this.buttonList, 70+x, 20+this.toolbarStartY, 15, 15, '#ebc117','>', 3, -5, 18, '#000000', 'selectEnemyFWRD'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 20+this.toolbarStartY, 15, 15, '#ebc117','<', 3, -5, 18, '#000000', 'selectEnemyBWRD'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 70+x, 58+this.toolbarStartY, 15, 15, '#ebc117','+', 3, -5, 18, '#000000', 'addEnemyAmount'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 58+this.toolbarStartY, 15, 15, '#ebc117','-', 3, -5, 18, '#000000', 'subEnemyAmount'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 70+x, 88+this.toolbarStartY, 15, 15, '#ebc117','+', 3, -5, 18, '#000000', 'addSpawnDelay'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 88+this.toolbarStartY, 15, 15, '#ebc117','-', 3, -5, 18, '#000000', 'subSpawnDelay'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 70+x, 118+this.toolbarStartY, 15, 15, '#ebc117','>', 3, -5, 18, '#000000', 'selectPathFWRD'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 20+x, 118+this.toolbarStartY, 15, 15, '#ebc117','<', 3, -5, 18, '#000000', 'selectPathBWRD'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
		GenerateButton(this.buttonList, 30+x, 138+this.toolbarStartY, 45, 20, '#ff4d4d','DEL', 3, -5, 20, '#000000', 'deleteEnemy'+this.currentWave+"sw"+swid, 'subWaveBTN'+this.currentWave);
	}

	this.selectEnemy = function(swid, direction){
		let position = this.levelData.wave[this.currentWave][swid].enemyType + direction;

		if (position < 0)
		{
			position = enemyList.length - 1;
		}
		if (position >= enemyList.length)
		{
			position = 0;
		}
		this.levelData.wave[this.currentWave][swid].enemyType = position;
	}

	this.removeEnemy = function(swid){
		if(this.levelData.wave[this.currentWave].length > 1)
		{
			this.levelData.wave[this.currentWave].splice(swid, 1)
		}
	}

	this.changeEnemyAmt = function(swid, amt){
		let enemyAmt = this.levelData.wave[this.currentWave][swid].amountToSpawn + amt;
		if (enemyAmt < 1)
		{
			enemyAmt = 1;
		}
		this.levelData.wave[this.currentWave][swid].amountToSpawn = enemyAmt;
	}

	this.changeEnemySpawnDelay = function(swid, amt){
		let delay = this.levelData.wave[this.currentWave][swid].delayBetweenSpawn + amt;
		if (delay < 0)
		{
			delay = 0;
		}
		this.levelData.wave[this.currentWave][swid].delayBetweenSpawn = delay;
	}

	this.selectEnemyPath = function(swid, direction){
		let path;
		let p;
		for(let i = 0; i < this.pathList.length; i++)
		{
			if(this.pathList[i] == this.levelData.wave[this.currentWave][swid].spawnOnPath)
			{
				p = i + direction;
				path = this.pathList[p];	
				break;
			}
		}
		if (p < 0)
		{
			path = this.pathList[this.pathList.length -1];
		}
		if (p >= this.pathList.length)
		{
			path = this.pathList[0];
		}
		this.levelData.wave[this.currentWave][swid].spawnOnPath = path;
		this.switchHighlightToPath(path);
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
			coins: 0,
			startOffset: {x:0, y:0},
			wave: []
		}

		for(i = 0; i < this.mapGumAltarPos.length; i++)
		{
			if(this.mapGumAltarPos[i] !== false)
			{
				this.levelData.gumAmounts.push(0);
			}
		}

		this.addNewWave();
		this.generateMainButtons();
	}

	this.moveMapWithMouse = function()
	{
		if (mouseY > this.toolbarStartY) return;
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

	this.switchHighlightToGumAltar = function(){
		this.highlightedGumAltar = this.currentGumAltar;
		this.highlightedPath = false;
	}

	this.switchHighlightToPath = function(path){
		this.highlightedPath = path;
		this.highlightedGumAltar = false;
	}

	this.highlightPath = function(path){
		if(path === false) return;

		let drawTileX = 0;
		let drawTileY = 0;
		for(let indexX = 0; indexX < this.rows ; indexX++) {
			for(let indexY = 0; indexY < this.cols; indexY++) {
					switch (this.map[path][indexX][indexY]) {
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
						case 5:
							colorRectWithAlpha(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, '#757357', 0.6)
							break;
					}
				
				
				//rectBorderOnly(offsetX + drawTileX, offsetY + drawTileY, TILE_SIZE, TILE_SIZE, 1, '#cccccc')
				drawTileY += TILE_SIZE;
			}
			drawTileX += TILE_SIZE;
			drawTileY = 0;
		}
	}

	this.highlightGumAltar = function(){
		if(this.highlightedGumAltar === false) return;
		let x =  returnPixelPosFromIndexPos(this.mapGumAltarPos[this.highlightedGumAltar].indexX);
		let y =  returnPixelPosFromIndexPos(this.mapGumAltarPos[this.highlightedGumAltar].indexY);
		colorRectWithAlpha(offsetX + x, offsetY + y, TILE_SIZE, TILE_SIZE, 'purple', 0.6)
	}

	this.onMouseClicked = function(){
		//var mouseIDX = pixeltoindex(mouseX);
		//var mouseIDY = pixeltoindex(mouseY);
		let enemybtns = returnBtnsFromGroup(this.buttonList, 'subWaveBTN'+this.currentWave);
		for(let j = 0; j < 6; j++)
		{
			let swid = (this.subWavePage * 6) + j;
			if(swid >= this.levelData.wave[this.currentWave].length)
			{
				break;
			}
			for(let g = 0; g < enemybtns.length; g++)
			{
				let msX = 315 + (75 * j);
				let i = enemybtns[g];
				if(mouseX > this.buttonList[i].x + msX && mouseX < this.buttonList[i].x + msX + this.buttonList[i].w &&
					mouseY > this.buttonList[i].y && mouseY < this.buttonList[i].y + this.buttonList[i].h)
				{
					this.switchHighlightToPath(this.levelData.wave[this.currentWave][swid].spawnOnPath);
					switch (this.buttonList[i].name) 
					{
						case 'selectEnemyFWRD'+this.currentWave+"sw"+swid:
							this.selectEnemy(swid, 1);
							return;
						case 'selectEnemyBWRD'+this.currentWave+"sw"+swid:
							this.selectEnemy(swid, -1);
							return;
						case 'addEnemyAmount'+this.currentWave+"sw"+swid:
							this.changeEnemyAmt(swid, 1);
							return;
						case 'subEnemyAmount'+this.currentWave+"sw"+swid:
							this.changeEnemyAmt(swid, -1);
							return;
						case 'addSpawnDelay'+this.currentWave+"sw"+swid:
							this.changeEnemySpawnDelay(swid, 1);
							return;
						case 'subSpawnDelay'+this.currentWave+"sw"+swid:
							this.changeEnemySpawnDelay(swid, -1);
							return;
						case 'selectPathFWRD'+this.currentWave+"sw"+swid:
							this.selectEnemyPath(swid, 1);
							return;
						case 'selectPathBWRD'+this.currentWave+"sw"+swid:
							this.selectEnemyPath(swid, -1);
							return;
						case 'deleteEnemy'+this.currentWave+"sw"+swid:
							this.removeEnemy(swid);
							return;
					}
				}
			}
		}

		let mainbtns = returnBtnsFromGroup(this.buttonList, "lvlEditorBTN")
		for(let g = 0; g < mainbtns.length; g++)
		{
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
						this.removeWave();	
						this.message = "Wave " + (this.currentWave + 1)+ " has been deleted.";		
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
						this.message = "Start delay for Wave " + (this.currentWave + 1) + " has been changed.";
						return;		
					case 'addStartDelayBTN':
						this.changeWaveStartDelay(1)
						this.message = "Start delay for Wave " +(this.currentWave + 1) + " has been changed.";
						return;
					case 'pageForwBTN':
						this.selectPage(1)
						this.message = "You are now on Page: " + this.subWavePage;
						return;
					case 'pageBackBTN':
						this.selectPage(-1)
						this.message = "You are now on Page: " + this.subWavePage;
						return;
					case 'subCoinsBTN':
						this.changeCoinAmt(-10)
						this.message = "Changed coin amount on start of Level.";
						return;
					case 'addCoinsBTN':
						this.changeCoinAmt(10)
						this.message = "Changed coin amount on start of Level.";
						return;
					case 'addEnemyBTN':
						this.addNewEnemy();
						this.subWavePage = Math.floor(this.levelData.wave[this.currentWave].length / 7);
						this.message = "New Enemy added.";
						return;
					case 'saveBTN':
						this.saveMap();	
						return;
					case 'lvlNameBTN':
						this.levelData.levelName = "";
						ChangeButtonAttribute(this.buttonList,'lvlNameBTN',"txt", "");
						ChangeButtonAttribute(this.buttonList,'lvlNameBTN',"bc", "#ff4d4d")
						this.message = "Type the level Name and than click again somewhere to confirm."
						editLvlName = true;
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

		GenerateButton(this.buttonList, 5, 140+this.toolbarStartY, 140, 20, '#17c0eb',this.lvlName, 4, -2, 16, '#000000', 'lvlNameBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 10, 5+this.toolbarStartY, 100, 20, '#ffb8b8','Save Level', 2, 0, 16, '#000000', 'saveBTN', 'lvlEditorBTN');

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
		GenerateButton(this.buttonList, 135, 115+this.toolbarStartY, 15, 20, '#17c0eb','-', 2, -4, 20, '#000000', 'subCoinsBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 185, 115+this.toolbarStartY, 15, 20, '#17c0eb','+', 2, -1, 16, '#000000', 'addCoinsBTN', 'lvlEditorBTN');


		GenerateButton(this.buttonList, 230, 50+this.toolbarStartY, 35, 20, '#ff4d4d','DEL', 1, -2, 18, '#000000', 'delWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 270, 50+this.toolbarStartY, 35, 20, '#32ff7e','ADD', 2, -2, 18, '#000000', 'addWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 235, 25+this.toolbarStartY, 15, 20, '#17c0eb','<', 3, -2, 18, '#000000', 'backWaveBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 285, 25+this.toolbarStartY, 15, 20, '#17c0eb','>', 3, -2, 18, '#000000', 'forwWaveBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 230, 90+this.toolbarStartY, 15, 20, '#17c0eb','-', 2, -4, 20, '#000000', 'subStartDelayBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 290, 90+this.toolbarStartY, 15, 20, '#17c0eb','+', 2, -1, 16, '#000000', 'addStartDelayBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 215, 130+this.toolbarStartY, 90, 20, '#32ff7e','addEnemy', 2, -2, 18, '#000000', 'addEnemyBTN', 'lvlEditorBTN');

		GenerateButton(this.buttonList, 315, 10+this.toolbarStartY, 15, 150, '#666060','<', 2, 60, 18, '#000000', 'pageBackBTN', 'lvlEditorBTN');
		GenerateButton(this.buttonList, 780, 10+this.toolbarStartY, 15, 150, '#666060','>', 2, 60, 18, '#000000', 'pageForwBTN', 'lvlEditorBTN');
	}
}
