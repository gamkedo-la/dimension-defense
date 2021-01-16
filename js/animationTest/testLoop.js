testloop= new function()
{
    let ids=[]
    this.init= function()
    {
        //console.log("looping");
    }


    this.onMouseClicked=function()
    {
        ids.push(animationSystem.register("multiState",this.getRandom(10),{X:mouseX,Y:mouseY}));
        console.log("clicked");
        ;
    }
    
    this.clearanimatedlist=function()
    {
        // testcode for removing by id.
        let id=this.getRandom(ids.length);
       
        if(animationSystem.destroyEntity(id))
        {
            ids.splice(id,1);
            console.log(id);
        }
       /* 
       animationSystem.resetList();
       ids=[];
       */
    }

    this.testStateChange=function()
    {
        animationSystem.sprite_stateChange(3,"strip2");
    }

    this.debug=function()
    {
        console.log(animationSystem.animatedlist);
        console.log("number of entities to animate "+animationSystem.entities);
        console.log(ids)
    }

    this.draw=function()
    {
        //console.log("drawing!");
        animationSystem.sprite_update(1,{X:mouseX,Y:mouseY})
        //drawImageWithAngle(this.mapName, offsetX, offsetY, 0);
    }

    this.getRandom=function(max)
    {
        let num=Math.random()*10 % max;
        return Math.floor(num);
    }
}