animationInfo=
{
     
   'testEnemy1':{
    row:1,
    col:5,
    cell_W:48,
    cell_H:48,
    maxFrame:5,
    startFrame:1,
    endFrame:5,
    currentFrame:1,
    flipH:false,
    flipY:false,        
    orient:"horizontal"
    },

    'AntEnemy':{
        row:1,
        col:4,
        cell_W:48,
        cell_H:48,
        maxFrame:4,
        startFrame:1,
        endFrame:4,
        currentFrame:1,
        flipH:false,
        flipY:false,        
        orient:"horizontal"
    },

    'multiState':{
        row:10,
        col:10,
        cell_W:16,
        cell_H:16,
        maxFrame:10,
        startFrame:9,
        endFrame:10,
        currentFrame:1,
        flipH:false,
        flipY:false,
        orient:"horizontal",

        state:
        {
            "strip1":1,
            "strip2":2,
            "strip3":3,
            "strip4":4,
            "strip5":5,
            "strip6":6,
            "strip7":7,
            "strip8":8,
            "strip9":9,
            "strip10":10
        }

    },

}

function HelplerCreateAnimatedAsset(assetName)
{
    let obj=Object.assign({},animationInfo[assetName])
    obj.name=assetName;
    return obj;
}