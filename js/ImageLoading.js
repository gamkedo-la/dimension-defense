var imageList = [];
var picsToLoad = 0; // set automatically based on imageArray in loadImages()

image = new function (){
	//Put all images here
	this.InitImageList = [
		{imgName: 'mapPencil', fileName: "mapPencil.png", type: 'gameMap'},
		{imgName: 'mapDrawnLand', fileName: "mapDrawnGreenLand.png", type: 'gameMap'},
		{imgName: 'bigMapTest', fileName: "bigMap.png", type: 'gameMap'},
		{imgName: 'toyCarMap', fileName: "toyCarMap.png", type: 'gameMap'},
		{imgName: 'blocksMap', fileName: 'blocksMap.png', type: 'gameMap'},

		{imgName: 'gunTowerL1', fileName: "towerGun-1.png", type: 'tower'},
		{imgName: 'gunTowerL2', fileName: "towerGun-2.png", type: 'tower'},
		{imgName: 'gunTowerL3', fileName: "towerGun-3.png", type: 'tower'},
		
		{imgName: 'slowTowerL1', fileName: "TowerSlow-1.png", type: 'tower'},
		{imgName: 'slowTowerL2', fileName: "TowerSlow-2.png", type: 'tower'},
		{imgName: 'slowTowerL3', fileName: "TowerSlow-3.png", type: 'tower'},

		{imgName: 'MissileTowerBase', fileName: "MissileTowerBase.png", type: 'tower'},
		{imgName: 'MissileTowerTurret', fileName: "MissileTowerTurret.png", type: 'tower'},
		{imgName: 'Missile', fileName: "Missile.png", type: 'tower'},
		{imgName: 'MuzzleFlash', fileName: "MuzzleFlash.png", type: 'tower'},
		{imgName: 'MissileTrail', fileName: "MissileTrail.png", type: 'tower'},

		{imgName: 'gum1', fileName: "gum-1.png", type: 'gum'},

		// enemies
		{imgName: 'turtleSingle', fileName: "enemyTurtleSingle.png", type: 'enemy'},
		{imgName: 'antSingle', fileName: "enemyAntSingle.png", type: 'enemy'},
		{imgName: 'carSingle', fileName: "enemyCarSingle.png", type: 'enemy'},

		// atlas for now, maybe animation strip will be better ,cas.
		{imgName:'strip16',fileName:"strip16.png",type:'animation',animationInfo:{Row:1,Col:10,orient:"horizontal"}},
		{imgName:'multiState',fileName:"testAtlas.png",type:'animation',animationInfo:{Row:10,Col:10,orient:"horizontal",state:{1:"state1",2:"state2",3:"state3",4:"state4",5:"state5"}}},
		
		//Loading animation sprites
		{imgName:'testEnemy1',fileName:"enemyTurtleSprite.png",type:'animation'},
		{imgName:'turtleEnemy',fileName:"enemyTurtleSprite.png",type:'animation'},
		{imgName:'AntEnemy',fileName:"enemyAntSprite.png",type:'animation'},
		{imgName:'CarEnemy',fileName:"enemyCarSprite.png",type:'animation'},
		{imgName:'UI_Coin',fileName:"Coin.png",type:'animation'},
	];

	//creating different lists upfront
	this.getByNameList = [];
	this.getByTypeList = [];

	//gets called in windows.onload (page startup)
	this.loadImages = function(){
		for(let i = 0; i < this.InitImageList.length; i++) {
			//Inserting everything into a seperate array to later call the images by name
			this.getByNameList[this.InitImageList[i].imgName] = document.createElement("img");
			this.getByNameList[this.InitImageList[i].imgName].src = "images/" + this.InitImageList[i].fileName;
			this.getByNameList[this.InitImageList[i].imgName].type = this.InitImageList[i].type;

			/*
			if(this.getByNameList[this.InitImageList[i].imgName].type == "animation")
			{
				this.getByNameList[this.InitImageList[i].imgName].animationInfo=this.InitImageList[i].animationInfo;
			}
			*/
			
			//Generate a pre-list for all the different image types and fill them. 
			if(this.getByTypeList[this.InitImageList[i].type] == undefined){
				this.getByTypeList.push(this.InitImageList[i].type);
				this.getByTypeList[this.InitImageList[i].type] = [];
			}
			this.getByTypeList[this.InitImageList[i].type].push(this.InitImageList[i].imgName);
		}
		return true;
	}

	//Get a single image from its name
	this.get = function(imgName){
		return this.getByNameList[imgName];
	}

	//get a list of image names from the same image type
	this.getAllTypesOf = function(typeName){
	
		if(this.getByTypeList[typeName] != undefined){
			return this.getByTypeList[typeName];
		}else{
			console.log("Cant find any image of this type: " + typeName);
			return false;
		}

	}
}

