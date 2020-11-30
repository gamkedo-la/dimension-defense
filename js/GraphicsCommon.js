
function drawBitmapCenteredWithRotation(imgName, atX,atY, withAng) {
	ctx.save();
	ctx.translate(atX, atY);
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

function drawImageScaled(imgName, atX,atY, scale) {
	ctx.save();
	ctx.scale(scale,scale);
	ctx.drawImage(image.get(imgName),atX ,atY , image.get(imgName).width, image.get(imgName).height);
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

function rectBorderOnly(posX, posY, Width, Height, borderLineWidth, borderColor){
	ctx.beginPath();
	ctx.lineWidth = borderLineWidth;
	ctx.strokeStyle = borderColor;
	ctx.rect(posX, posY, Width, Height);
	ctx.stroke();
}

function colorText(showWords, textX, textY, fontSize, fillColor) {
	ctx.font = fontSize + "px courier";
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