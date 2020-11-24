//The beginnings of an animation system

class animate{

    constructor()
    {
        this._gTime=0;
        this._elapsedTime=0;
        this._currentTime=0;
        this.row=1;
        this.col=1;
        this.max=10;
        this.listOfAnimatedSpriteNames=[];
        this.animatedSpriteList={};
        this.processAnimatedList=false;
    }
    
    
    init()
    {
        this.listOfAnimatedSpriteNames=image.getAllTypesOf("animation");
        for(let i=0; i <this.listOfAnimatedSpriteNames.length; i++)
        {   
            
            this.animatedSpriteList[this.listOfAnimatedSpriteNames[i]]=image.get(this.listOfAnimatedSpriteNames[i]);
        }

    }


    update()
    {
        //On the first update animations get process with more information(This process should be initialized after document loads)
        if(this.processAnimatedList==false)
        {
            console.log("processing animation");
            this._processStrip();
            this.processAnimatedList=true;
        }
        this._gTime+=1;
    }

    
    spriteStrip(name,atX,atY,fps=1,loop=true)
    {
        let spriteInfo=this.animatedSpriteList[name].animationInfo;
        //console.log(spriteInfo);
        if((this._gTime % fps) == 0)
        {
                  this.col+=1;    
        }
        
        if(loop)
        {
            drawSprite(name,this.row,(this.col%10)+1,16,16,atX,atY);
        }
        else
        {
            if(this.col<this.max)
            {
                drawSprite(name,this.row,this.col,16,16,atX,atY);
            }else
            {
                drawSprite(name,this.row,this.max,16,16,atX,atY);
            }
        }
    }

    //class internal function
    _processStrip()
    {
        for(let i=0; i<this.animatedSpriteList.length;i++)
        {
            let currObj=this.animatedSpriteList[i];
            if(currObj.animationInfo.orient=="horizontal")
            {
                currObj.animationInfo.dimX=currObj.width/currObj.animationInfo.Col;
                currObj.animationInfo.dimY=currObj.animationInfo.dimX;
            }
            if(currObj.animationInfo.orient=="vertical")
            {
                currObj.animationInfo.dimY=currObj.height/currObj.animationInfo.Row;
                currObj.animationInfo.dimX=currObj.animationInfo.dimY;
            }

            if(currObj.animationInfo.state!=undefined)
            {
                console.log("Multi-State Sprite")
            }
        }
        
    }
}


