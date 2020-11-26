animationInfo=
{
     
   'testEnemy1':{
    row:1,
    col:5,
    cell_W:32,
    cell_H:32,
    maxFrame:5,
    startFrame:1,
    endFrame:5,
    currentFrame:1,        
    orient:"horizontal"
},

}

function HelplerCreateAnimatedAsset(assetName)
{
    let obj=Object.assign({},animationInfo[assetName])
    obj.name=assetName;
    return obj;
}