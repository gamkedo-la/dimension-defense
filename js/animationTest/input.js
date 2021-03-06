const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

var mouseX = 0;
var mouseY = 0;

var draggingMouse = false;
var dragMouseX = 0;
var dragMouseY = 0;
var dragMouseDX = 0; // delta X (dist)
var dragMouseDY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	document.addEventListener("mousedown", mouseclicked);
	document.addEventListener("mouseup", mouseUp);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
} 

function mouseUp(evt) {
    //console.log("mouse is up!");
    draggingMouse = false;
	//dragMouseDX = 0;
	//dragMouseDY = 0;
}

function mouseclicked(evt) {
	switch (scene) {
		case 'game':
			testloop.onMouseClicked();
            //console.log("mouse is down!");
            draggingMouse = true; // this is a mouseDown event
            dragMouseX = mouseX;
            dragMouseY = mouseY;
            //dragMouseDX = 0;
            //dragMouseDY = 0;

			break;
	}
	
  }

  // FIXME: NOT USED?
  function mousemoved(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
  }


function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

    if (draggingMouse) {
        dragMouseDX += mouseX - dragMouseX;
    	dragMouseDY += mouseY - dragMouseY;
    	dragMouseX = mouseX;
    	dragMouseY = mouseY;
    	//console.log("dragging mouse: "+mouseX+","+mouseY);
    }

}

function keySet(keyEvent, setTo) {

}

function keyPressed(evt) {
	//cheats(evt.key);
	//console.log("Key pressed: "+evt.keyCode);
    keySet(evt, true);
    if (evt.keyCode==KEY_A)
    {
        testloop.clearanimatedlist();
    }

    if(evt.keyCode==KEY_D)
    {
        testloop.debug();
    }

    if(evt.keyCode==KEY_S)
    {
        testloop.testStateChange();
    }

	evt.preventDefault();
}

function keyReleased(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	keySet(evt, false);
}