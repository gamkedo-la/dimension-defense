//stores button data into the buttonList array to draw them later with drawButtons();
function GenerateButton(intoArray, topLeftX, topLeftY, buttonWidth, buttonHeight,buttonColor, text, textoffsetX, textoffsetY, fontSize, fontColor, buttonName, buttonGroup) {
	let button ={
		x: topLeftX,
		y: topLeftY,
		w: buttonWidth,
		h: buttonHeight,
		bc: buttonColor,
		txt: text,
		txtOfX: textoffsetX,
		txtOfY: textoffsetY,
		fs: fontSize,
		fc: fontColor,
		name: buttonName,
		group: buttonGroup
	}
	intoArray.push(button);
}

//draws the button groups from the button list array
function drawButtons(fromArray, ...buttonGroups){
	for(let i = 0; i < fromArray.length; i++){
		for(let a = 0; a < buttonGroups.length; a++){
			if(fromArray[i].group == buttonGroups[a]){
				colorRect(fromArray[i].x, fromArray[i].y, fromArray[i].w, fromArray[i].h, fromArray[i].bc);
				colorText(fromArray[i].txt, fromArray[i].x + fromArray[i].txtOfX, fromArray[i].y + fromArray[i].fs + fromArray[i].txtOfY,fromArray[i].fs, fromArray[i].fc);
			}
		}
	}
}

function drawButtonSingle(fromArray, buttonName){
	for(let i = 0; i < fromArray.length; i++){
		if(fromArray[i].name == buttonName){
			colorRect(fromArray[i].x, fromArray[i].y, fromArray[i].w, fromArray[i].h, fromArray[i].bc);
			colorText(fromArray[i].txt, fromArray[i].x + fromArray[i].txtOfX, fromArray[i].y + fromArray[i].fs + fromArray[i].txtOfY,fromArray[i].fs, fromArray[i].fc);
			return;
		}
	}
}

function ChangeButtonAttribute(fromArray, buttonName, attribute, newData){
	for(let i = 0; i < fromArray.length; i++){
		if(fromArray[i].name == buttonName){
			fromArray[i][attribute] = newData;
			return;
		}
	}
}



function drawBitmapCenteredWithRotation(imgName, atX,atY, withAng) {
	ctx.save();
	ctx.translate(atX, atY);
	ctx.rotate(withAng);
	ctx.drawImage(image.get(imgName), image.get(imgName).width/2, image.get(imgName).height/2);
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
	ctx.drawImage(image.get(imgName),atX ,atY , (scale / 100) * image.get(imgName).width, (scale / 100) * image.get(imgName).height);
}

function drawImageAtWidthSize(imgName, atX,atY, widthSize) {
	ctx.drawImage(image.get(imgName),atX ,atY , widthSize, (widthSize / image.get(imgName).width) * image.get(imgName).height);
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

function copyToClipboard(theThing){
	let dummy = document.createElement("textarea");
			document.body.appendChild(dummy);
			dummy.value = JSON.stringify(theThing) + ',';
			dummy.select();
			document.execCommand("copy");
			document.body.removeChild(dummy);
			return;
}