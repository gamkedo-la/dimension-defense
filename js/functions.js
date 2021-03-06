
function collisionCheckWithAllEnemy(x, y, r)
{
    let collidedEnemies = [];
    for(let i = 0; i < gameLoop.enemyList.length; i++)
    {
        if(collisionCheckRoundShapes(x, y, r, gameLoop.enemyList[i].x, gameLoop.enemyList[i].y, gameLoop.enemyList[i].r))
        {
            collidedEnemies.push(i);
        }		
    }
    if(collidedEnemies.length == 0)
    {
        return false;
    }

    return collidedEnemies;
}

function collisionCheckRoundShapes(obj1x, obj1y,obj1r, obj2x, obj2y, obj2r)
{
    let distX = obj1x - obj2x;
	let distY = obj1y - obj2y;
	let distR = obj1r + obj2r;

    if ( distR > Math.sqrt((distX * distX) + (distY * distY)))
    {
		return true;
	} else {
		return false;
	}
}

function degreesToRadian(degrees)
{
    return degrees * Math.PI / 180;
}

function returnPixelPosFromIndexPos(tileIndexNumber)
{
    return tileIndexNumber * TILE_SIZE;
}

function returnIndexPosFromPixelPos(pixelCoordinate)
{
    return Math.floor(pixelCoordinate / TILE_SIZE);
}

function getAngleBetween2PointsInRadian(p1X, p1Y, p2X, p2Y)
{
    return  Math.atan2(p2Y - p1Y, p2X - p1X);
}

function copyArray(arrayToCopy)
{
    return JSON.parse(JSON.stringify(arrayToCopy));
}