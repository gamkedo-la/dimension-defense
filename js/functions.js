
function returnPixelPosFromIndexPos(tileIndexNumber, offsetAxis) {
    switch (offsetAxis)
    {
        case undefined:
            offsetAxis = 0;
            break;
        case 'x':
            offsetAxis = offsetX;
            break;
        case 'y':
            offsetAxis = offsetY;
            break;
    }
	return tileIndexNumber * TILE_SIZE - offsetAxis;
}

function returnIndexPosFromPixelPos(pixelCoordinate, offsetAxis) {
    switch (offsetAxis)
    {
        case undefined:
            offsetAxis = 0;
            break;
        case 'x':
            offsetAxis = offsetX;
            break;
        case 'y':
            offsetAxis = offsetY;
            break;
    }    
	return Math.floor((pixelCoordinate - offsetAxis) / TILE_SIZE);
}
