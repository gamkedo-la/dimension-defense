const MainMenu = new (function () {
  let current = 0;
  let cursor = 0;

  let itemsX = 240;
  let topItemY = 240;
  let itemsWidth = 300;
  let itemsHeight = 50;
  let rowHeight = 60;
  let textSizePassive = 40;
  let textSizeActive = 45;

  let selectedItemOnPage;

  let currentMenu = "main";

  let mainMenuList = [
    "Play Game",
    "Volume",
    "Credits",
  ];

  this.update = function () {
    this.menuMouse();
    // Position arrow at last option on screen
    if (this.cursor < 0) {
      this.cursor = mainMenuList.length - 1;
    }

    // Position arrow at first option on screen
    if (this.cursor >= mainMenuList.length) {
      this.cursor = 0;
    }

  }
 
  this.draw = function () {
    colorRect(0, 0, canvas.width, canvas.height, '#3d3d3d');

    switch(currentMenu)
				{
					case "main":
            this.drawMainMenu();
            break;
        }

  }

  this.drawMainMenu = function()
  {
    for (let i = 0; i < mainMenuList.length; i++) {
      colorRectWithAlpha(topItemY, itemsX - 30 + rowHeight *i, itemsWidth, itemsHeight, '#17c0eb', 0.85);
      colorTextBold(
        mainMenuList[i],
        itemsX + 10,
        topItemY + 5 + (rowHeight * i),
        textSizePassive,
        "white"
      );
      if (mainMenuList[i] == 'Volume' ) {
        colorTextBold(
          Math.floor(effectsVolume * 100) +  "%" ,
          itemsX + itemsWidth + 10,
          topItemY + rowHeight * i,
          textSizePassive,
          "white"
        );
      }
    }
  }

  this.checkState = function() {
    selectedItemOnPage = mainMenuList[this.cursor];
    for (let i = 0; i < mainMenuList.length; i++){
      if (selectedItemOnPage === mainMenuList[i].toString()) {
          colorRect(topItemY, itemsX - 30 + rowHeight * i, itemsWidth, itemsHeight, '#7158e2');
          colorTextBold(
            mainMenuList[i].toString(),
            itemsX + 10,
            topItemY + 5 +(rowHeight * i),
            textSizeActive,
            "#00ffAA"
          );
      }
    }
  }

  this.mouseClicked = function()
	{
    this.cursor = 0;

    if(currentMenu == "main")
    {
      for (let i = 0; i < mainMenuList.length; i++)
      {
        if (selectedItemOnPage === mainMenuList[i].toString()) 
        {
          switch(selectedItemOnPage)
          {
            case "Play Game":
              //this.currentMenu = "playGame";
              gameLoop.init('lvlPencil');
              scene = "game";
              break;
            case 'Volume':
              if (turnVolumeUp() == false) {
                setVolume(0);
              }
              break;
            default:
              console.log("unhandeled menu item");
              break;
          }
        }
      }
    }

  }

  this.menuMouse = function () {
    const selectedItemOnPage = mainMenuList[this.cursor];
    for (let i = 0; i < mainMenuList.length; i++) {
      if (
        //mouseX > itemsX - 350 && mousePosX + itemsWidth &&
        mouseY + rowHeight / 2 > topItemY + i * rowHeight &&
        mouseY + rowHeight / 2 < topItemY + (i + 1) * rowHeight
      ) {
        this.setCursorAndCurrentPage(i);
      }
    }
  }

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