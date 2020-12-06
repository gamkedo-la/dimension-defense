const Menu = new (function () {
  let current = 0;
  let cursor = 0;

  let itemsX = 240;
  let topItemY = 240;
  let itemsWidth = 300;
  let rowHeight = 40;

  let pausMenuList = [
    "Options",
    "restart",
    "help",
  ];

  let menuText = [
    pausMenuList,
  ];
 
  this.draw = function () {
    drawImageWithAngle("gum1", itemsX , topItemY + this.cursor * rowHeight - 30 , 0);
      for (let i = 0; i < menuText[current].length; i++) {
        colorRect(topItemY, itemsX - 30 + rowHeight *i, itemsWidth, 30, '#00ff0f');
        colorTextBold(
          menuText[current][i],
          itemsX,
          topItemY + rowHeight * i,
          60,
          "white"
        );
    }
  }

  this.update = function () {
    this.menuMouse();
    // Position arrow at last option on screen
    if (this.cursor < 0) {
      this.cursor = pausMenuList[current].length - 1;
    }

    // Position arrow at first option on screen
    if (this.cursor >= pausMenuList[current].length) {
      this.cursor = 0;
    }
  }

  this.checkState = function checkState () {
    const selectedItemOnPage = menuText[current][this.cursor];
    for (let i = 0; i < menuText[current].length; i++){
      if (selectedItemOnPage === menuText[current][i].toString()) {
          colorRect(topItemY, itemsX - 30 + rowHeight * i, itemsWidth, 30, 'red');
          colorTextBold(
            menuText[current][i].toString(),
            itemsX,
            topItemY + rowHeight * i,
            60,
            "#00ffAA"
          );  
      } 
    }
    this.cursor = 0;
  }

  this.menuMouse = function () {
    //colorTextShadow(menuPageText[currentPage][i].split('').join(' '), itemsX - 350, topItemY + rowHeight * i, "#09A9A9", "35px Arial");
    for (let i = 0; i < menuText[current].length; i++) {
      if (
        //mouseX > itemsX - 350 && mousePosX + itemsWidth &&
        mouseY + rowHeight / 2 > topItemY + i * rowHeight &&
        mouseY + rowHeight / 2 < topItemY + (i + 1) * rowHeight
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