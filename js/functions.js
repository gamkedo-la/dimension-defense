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

function returnPixelPosFromIndexPos(tileIndexNumber, offsetAxis)
{
    switch (offsetAxis)
    {
        case 'x':
            return tileIndexNumber * TILE_SIZE - offsetX;
        case 'y':
            return tileIndexNumber * TILE_SIZE - offsetY;
    }
}

function returnIndexPosFromPixelPos(pixelCoordinate, offsetAxis)
{
    switch (offsetAxis)
    {
        case 'x':
            return Math.floor((pixelCoordinate - offsetX) / TILE_SIZE);
        case 'y':
            return Math.floor((pixelCoordinate - offsetY) / TILE_SIZE);
    }    
	
}

function getAngleBetween2PointsInRadian(p1X, p1Y, p2X, p2Y){
    return  Math.atan2(p2Y - p1Y, p2X - p1X);
}
