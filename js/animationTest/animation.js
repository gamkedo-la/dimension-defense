//The beginnings of an animation system

class animate{

    constructor()
    {
        this._gTime=0;
        this._elapsedTime=0;
        this._currentTime=0;
        this.animatedlist=[];
    }
    
    
    init()
    {
      console.log("Animation Module Init");
      console.log(animationInfo['strip16']);
    }

    register(Assetname)
    {
        let asset=[]
        asset=animationInfo[Assetname]
        this.animatedlist.push(asset);
        //console.log(this.animatedlist);
    }
    update()
    {
        this._gTime+=1;
    }

    
    spriteStrip(name,atX,atY,fps=1,loop=true)
    {

       this.animatedlist.forEach(sprite => {
            
            if(this._gTime > fps)
            {
                    sprite.currentFrame+=1;
                    this._gTime=0;
            }
            
            if(loop)
            {
                drawSprite(name,
                        sprite.startFrame,
                        (sprite.currentFrame%sprite.maxFrame)+1,
                        sprite.cell_W,
                        sprite.cell_H,
                        atX,
                        atY);
            }
            else
            {
                if(sprite.currentFrame>sprite.maxFrame)
                {
                    sprite.currentFrame=sprite.endFrame;
                }

                drawSprite(name,
                    sprite.startFrame,
                    sprite.currentFrame,
                    sprite.cell_W,
                    sprite.cell_H,
                    atX,
                    atY);
            }
            
       });
        
     
    }

    
}


