//The beginnings of an animation system
//Manager is created in windows.onload main.js file
class animate{

    constructor()
    {
        this._gTime=0;
        this._elapsedTime=0;
        this._currentTime=0;
        this.animatedlist=[];
        this.entities=0;
        this.emptyid=[];
    }
    
    
    init()
    {
      console.log("Animation Module Init");
    }

    update()
    {
        this._gTime+=1;
        this.animatedlist.forEach(sprite => this.anim_loop(sprite));
        //console.log(this.animatedlist);
    }

    
    register(Assetname,fps,objectRef)
    {
        let obj=HelplerCreateAnimatedAsset(Assetname)
        obj.fps=fps
        
        obj.pos=objectRef;
       // console.log(obj.pos.X);
        this.entities+=1;


        if(this.animatedlist.indexOf(null)!=-1)
        {
            let id=this.animatedlist.indexOf(null)
            this.animatedlist[id]=obj;
            return id+1;
        }
        else
        {
            this.animatedlist.push(obj);
            return this.entities;
        }      
    }


    sprite_update(id,pos_object)
    {
        let sprite=this.animatedlist[id-1]
        
        if(sprite!=null)
        {
           //console.log(sprite);
           sprite.pos=pos_object;
        }
    }

    sprite_stateChange(id,stripName,speed)
    {
        
        let sprite=this.animatedlist[id-1];
        if (sprite!=null)
        {
            //console.log(sprite.state);
            sprite.startFrame=sprite.state[stripName];
        }
    }

    anim_loop(sprite,fps)
    {
        if(sprite !=null)
        {
            if (this._gTime % sprite.fps == 0)
            {
                sprite.currentFrame+=1;
            }
            
            drawSprite(sprite.name,
                sprite.startFrame,
                (sprite.currentFrame%sprite.maxFrame)+1,
                sprite.cell_W,
                sprite.cell_H,
                sprite.pos.X,
                sprite.pos.Y);
                
        }

    }

    
    resetList()
    {
        this.animatedlist=[]
        this.entities=0;
    }

    destroyEntity(id)
    {
        if (this.animatedlist[id-1]!=null && this.entities >0)
        {
            
            this.animatedlist[id-1]=null;
            this.entities-=1;
            console.log(this.animatedlist);
            return true;
           
        }
        return false;
    }

}

 



