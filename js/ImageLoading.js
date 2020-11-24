var imageList = [];
var picsToLoad = 0; // set automatically based on imageArray in loadImages()

image = new function (){
	//Put all images here
	this.InitImageList = [
		{imgName: 'mapPencil', fileName: "mapPencil.png", type: 'gameMap'},
		{imgName: 'mapDrawnLand', fileName: "mapDrawnGreenLand.png", type: 'gameMap'},
		{imgName: 'bigMapTest', fileName: "bigMap.png", type: 'gameMap'},
		{imgName: 'toyCarMap', fileName: "toyCarMap.png", type: 'gameMap'},

		{imgName: 'gunTower', fileName: "gunTower.png", type: 'tower'},
		{imgName: 'slowTower', fileName: "slowTower.png", type: 'tower'},

		{imgName: 'gum1', fileName: "gum-1.png", type: 'gum'},
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

