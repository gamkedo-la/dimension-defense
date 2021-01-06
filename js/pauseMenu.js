const PauseMenu = new (function () {
  let current = 0;
  let cursor = 0;

  let itemsX = 240;
  let topItemY = 200;
  let itemsWidth = 300;
  let itemsHeight = 50;
  let rowHeight = 55;

  let pausMenuList = [
    "resume",
    "volume",
    "restart",
    "exit"
  ];

  let menuText = [
    pausMenuList,
  ];
 
  this.draw = function () {
      for (let i = 0; i < menuText[current].length; i++) {
        rectBorderOnly(itemsX,topItemY + rowHeight *i, itemsWidth, itemsHeight, 3, '#ffff00');
        colorRectWithAlpha(itemsX,topItemY + rowHeight *i, itemsWidth, itemsHeight, '#00ff0f', 0.85);
        colorTextBold(
          menuText[current][i],
          itemsX + 10,
          topItemY + rowHeight * i + itemsHeight/1.5,
          40,
          "white"
        );
        if (menuText[current][i] == 'volume' ) {
          colorTextBold(
            Math.floor(effectsVolume * 100) +  "%" ,
            itemsX + itemsWidth + 10,
            topItemY + rowHeight * i+ itemsHeight/1.5,
            40,
            "white"
          );
        }
    }
  }

  this.update = function () {
    this.menuMouse();
    // Position arrow at last option on screen
    if (this.cursor < 0) {
      this.cursor = menuText[current].length - 1;
    }

    // Position arrow at first option on screen
    if (this.cursor >= menuText[current].length) {
      this.cursor = 0;
    }
  }

  this.checkState = function() {
    const selectedItemOnPage = menuText[current][this.cursor];
    for (let i = 0; i < menuText[current].length; i++){
      if (selectedItemOnPage === menuText[current][i].toString()) {
          colorRect(itemsX,topItemY + rowHeight *i, itemsWidth, itemsHeight, 'red');
          colorTextBold(
            menuText[current][i].toString(),
            itemsX + 10,
            topItemY + rowHeight * i + itemsHeight/1.5,
            45,
            "#00ffAA"
          );
      }
      this.mouseClicked = function()
	  {
    for (let i = 0; i < menuText[current].length; i++){
      if (selectedItemOnPage === menuText[current][i].toString()) {
        switch(selectedItemOnPage)
				{
					case "restart":
                gameLoop.init(gameLoop.levelName);
                scene = 'game';
            break;
          case 'resume':
          StopGame();
            break;
            case 'help':

              break;
          case 'volume':
            if (turnVolumeUp() == false) {
              setVolume(0);
            }
            break;
            case 'exit':
                scene = "mainMenu";
            break;
          default:
            console.log("unhandeled menu item");
            break;
        }

    }
  }
}
      drawImageWithAngle("gum1", itemsX , topItemY + this.cursor * rowHeight + itemsHeight/1.5 , 90);
    }
    this.cursor = 0;
  }

  this.menuMouse = function () {
    const selectedItemOnPage = menuText[current][this.cursor];
    for (let i = 0; i < menuText[current].length; i++) {
      if (
        //mouseX > itemsX - 350 && mousePosX + itemsWidth &&
        mouseY > topItemY + i * rowHeight &&
        mouseY < topItemY + i * rowHeight + itemsHeight
      ) {
        this.setCursorAndCurrentPage(i);
      }
    }
  };

  this.setCursorAndCurrentPage = function (cursor = this.cursor) {
    // For now, only allow selection of an option on the main menu page
    if (current !== 0) {
      return;
    }

    this.cursor = cursor;
    // Change page
    currentPage = this.cursor;

    // Set the cursor at the first option of the new screen
    this.checkState();
    //selectionSFX.play();
  };
});