// The cheatcode buffer stores strings between key presses
var cheatBuffer = "";

/*
INFO: copy the whole "cheat ={...}" part and insert your own stuff in the cheatList array.

code: The cheatcode, must be all lowercase! Uppercase is reserved for special keys.
active: Tells if the cheatcode is enabled or disabled. Action will not run if disabled. Takes true or false.
action: Runs the code when a cheat gets activated.

(Special keys: U = ArrowUp; D = ArrowDown; L = ArrowLeft; R = ArrowRight)
*/

function cheats(key, isSingleKeyRun) {

let isDebugModeON = true;

//The CheatList array
let cheatList = [
	cheat = 
	{
		code: '1',
		active: isDebugModeON,
		action: function() {
			gameLoop.init('lvlPencil');
		}
	},
	cheat = 
	{
		code: '2',
		active: isDebugModeON,
		action: function() {
			gameLoop.init('lvlGreenLand');
		}
	},
	cheat = 
	{
		code: '3',
		active: isDebugModeON,
		action: function() {
			gameLoop.init('lvlBlocks');
		}
	},
	cheat = 
	{
		code: '4',
		active: isDebugModeON,
		action: function() {
			gameLoop.init('toyCarMap');
		}
	},	
];


//
//CheatCode function after here.
//
	let mightMatchCode = 0; //counts possible solutions
	let keyBuffer = "";
	
	// Turn inputs to lowercase and special case buttons to uppercase letters
	if(key.length === 1) 
	{
		keyBuffer = key.toLowerCase();
	} else{
		switch(key)
		{
			case "ArrowUp":
				keyBuffer = "U";
				break;
			case "ArrowDown":
				keyBuffer = "D";
				break;
			case "ArrowLeft":
				keyBuffer = "L";
				break;
			case "ArrowRight":
				keyBuffer = "R";
				break;		
		}
	}
	

	
	if(keyBuffer != "") {
		//add the pressed key to the current buffer string
		cheatBuffer += keyBuffer;
		//run a check for each cheatcode in the array
		cheatList.forEach (function (val,index) {
			//Give points for each cheatCode in the array
			mightMatchCode++;
			//check if cheatbuffer string matches to an element
			for (let i = 0; i < cheatBuffer.length; i++) {	
				if (cheatBuffer.charAt(i) == val.code.charAt(i)) {			
					//If cheatcode fully matches and is active
					if(cheatBuffer == val.code && val.active == true) {
						console.log("cheat activated: " + val.code);
						val.action();	
						//break;		
					}
				} else {
					//remove point if string doesnt matched
					mightMatchCode--;
					break;						
				}
			}
		});

		//Reset complete string if nothing has matched.
		//We keep the last string in the cheatbuffer in case of crosstyping.
		if (mightMatchCode == 0 && keyBuffer.length == 1 && keyBuffer != " " && cheatBuffer.length > 1) {
			cheatBuffer = "";
			//We run this to see if it was a single letter cheatCode
			cheats(keyBuffer,true);
		}
	}
}
