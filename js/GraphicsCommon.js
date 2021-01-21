
function drawBitmapCenteredWithRotation(imgName, atX,atY, withAng) {
	ctx.save();
	ctx.translate(atX, atY);
	ctx.rotate(withAng);
	ctx.drawImage(image.get(imgName), -image.get(imgName).width/2, -image.get(imgName).height/2);
	ctx.restore();
}

function drawBitmapCenteredWithRotationAndScale(imgName, atX,atY, withAng, scale) {
	ctx.save();
	ctx.translate(atX, atY);
    ctx.scale(scale,scale);
	ctx.rotate(withAng);
	ctx.drawImage(image.get(imgName), -image.get(imgName).width/2, -image.get(imgName).height/2);
	ctx.restore();
}

function drawImageWithAngle(imgName, atX,atY, atAngel) {
	ctx.save();
	ctx.translate(atX, atY);
	ctx.rotate(atAngel);
	ctx.drawImage(image.get(imgName),0,0);
	ctx.restore();
}

function drawImageScaledToWidthSize(imgName, atX,atY, widthSize) {
	ctx.drawImage(image.get(imgName),atX ,atY , widthSize, (widthSize / image.get(imgName).width) * image.get(imgName).height);
}

function drawImageScaled(imgName, atX,atY, scale) {
	ctx.save();
	ctx.translate(atX,atY);
	ctx.scale(scale,scale);
	ctx.drawImage(image.get(imgName),0,0);
	ctx.restore();
}

function drawImageflippedHorizontally(imgName, atX,atY) {
	ctx.save();
	ctx.translate(atX+image.get(imgName).width,atY);
	ctx.scale(-1,1);
	ctx.drawImage(image.get(imgName), 0, 0);
	ctx.restore();
}


function drawImageflippedHorizontallyAndCentered(imgName, atX,atY) {
	ctx.save();
	ctx.translate(atX + image.get(imgName).width - image.get(imgName).width/2, atY - image.get(imgName).height/2);
	ctx.scale(-1,1);
	ctx.drawImage(image.get(imgName), 0,0);
	ctx.restore();
}

function drawImageflippedVertically(imgName, atX,atY) {
	ctx.save();
	ctx.translate(atX,atY+image.get(imgName).height);
	ctx.scale(1,-1);
	ctx.drawImage(image.get(imgName), 0 , 0);
	ctx.restore();
}

function drawImageflippedVerticallyAndCentered(imgName, atX,atY) {
	ctx.save();
	ctx.translate(atX - image.get(imgName).width/2,atY + image.get(imgName).height -image.get(imgName).height/2);
	ctx.scale(1,-1);
	ctx.drawImage(image.get(imgName), 0 , 0);
	ctx.restore();
}

function drawImageWithSize(imgName, atX,atY, withSize) {
	ctx.drawImage(image.get(imgName),atX ,atY , withSize, (withSize / image.get(imgName).width) * image.get(imgName).height);
}

function colorRectWithAlpha(topLeftX,topLeftY, boxWidth,boxHeight, fillColor, alpha) {
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.fillStyle = fillColor;
	ctx.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
	ctx.restore();
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	ctx.fill();
}

function colorCircleWithAlpha(centerX,centerY, radius, fillColor, alpha) {
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	ctx.fill();
	ctx.restore();
}

function colorCircleBorderOnlyWithAlpha(centerX,centerY, radiusCircle, borderRadius, borderColor, alpha) {
	ctx.save();

	ctx.globalAlpha = alpha;
	
	ctx.beginPath();
	ctx.arc(centerX, centerY, borderRadius, 0,Math.PI*2, false);
	ctx.fillStyle = borderColor;
	ctx.arc(centerX, centerY, radiusCircle, 0,Math.PI*2, true);
	ctx.fill();
	ctx.restore();
}

function rectBorderOnly(posX, posY, Width, Height, borderLineWidth, borderColor){
	ctx.beginPath();
	ctx.lineWidth = borderLineWidth;
	ctx.strokeStyle = borderColor;
	ctx.rect(posX, posY, Width, Height);
	ctx.stroke();
}

function colorText(showWords, textX, textY, fontSize, fillColor) {
	ctx.font = fontSize + "px Arial";
	ctx.fillStyle = fillColor;
	ctx.fillText(showWords, textX, textY);
}

function colorTextBold(showWords, textX, textY, fontSize, fillColor) {
	ctx.font = "bold " + fontSize + "px courier";
	ctx.fillStyle = fillColor;
	ctx.fillText(showWords, textX, textY);
}

//Used internally for animationSystem.
function drawSprite(imgName,row,col,dimensionX,dimensionY,atX,atY)
{
	/*
		var maxFrame=image.get(imgName).animationInfo.maxFrame;
		var imgN=image.get(imgName);
		var dimX=image.get(imgName).width;
		var dimY=image.get(imgName).height;
	*/
	
	ctx.drawImage(image.get(imgName),(col-1)*dimensionX,(row-1)*dimensionY,dimensionX,dimensionY,atX,atY,dimensionX,dimensionY)
	//ctx.drawImage(image.get(imgName),0,0,dimensionX,dimensionY,atX,atY,dimensionX,dimensionY)
}

function drawSpriteAngle_Multi(imgName,row,col,dimensionX,dimensionY,atX,atY,atAngle,maxRows) {
	ctx.save();
	ctx.translate(atX, atY);
	ctx.rotate(atAngle);
	ctx.drawImage(image.get(imgName),(col-1)*dimensionX,(row-1)*dimensionY,dimensionX,dimensionY,-(image.get(imgName).width/maxRows)/2,-image.get(imgName).height/maxRows,dimensionX,dimensionY);
	ctx.restore();
}

function drawSpriteAngle_Single(imgName,row,col,dimensionX,dimensionY,atX,atY,atAngle,maxRows,flipH,flipV) {
	ctx.save();
	ctx.translate(atX, atY);
	if(flipH){ctx.scale(-1,1)};
	if(flipV){ctx.scale(1,-1)};
	ctx.rotate(atAngle);
	ctx.drawImage(image.get(imgName),(col-1)*dimensionX,(row-1)*dimensionY,dimensionX,dimensionY,-(image.get(imgName).width/maxRows)/2,-image.get(imgName).height/2,dimensionX,dimensionY);
	ctx.restore();
}

function angledLine(atX,atY,length,ang,color) {
	var halfLineOffsetX = Math.cos(ang) * length;
	var halfLineOffsetY = Math.sin(ang) * length;
	ctx.strokeStyle = color;
	ctx.lineWidth = 5;//was being reset by other calls 
	ctx.beginPath();
	ctx.moveTo(atX-halfLineOffsetX,atY-halfLineOffsetY);
	ctx.lineTo(atX+halfLineOffsetX,atY+halfLineOffsetY);
	ctx.stroke();
}


function angledLineThicker(atX,atY,length,ang,color) {
	var halfLineOffsetX = Math.cos(ang) * length;
	var halfLineOffsetY = Math.sin(ang) * length;
	ctx.strokeStyle = color;
	ctx.lineWidth = 10;//was being reset by other calls 
	ctx.beginPath();
	ctx.moveTo(atX-halfLineOffsetX,atY-halfLineOffsetY);
	ctx.lineTo(atX+halfLineOffsetX,atY+halfLineOffsetY);
	ctx.stroke();
}

