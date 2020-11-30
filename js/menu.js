const pausMenu = new (function () {
    const RESUME = 1;
    const OPTIONS = 2;
    const HELP = 3;
let current = 0;



let itemsX = 240;
  let topItemY = 240;
  let itemsWidth = 300;
  let rowHeight = 40;
  let colHeight = 60;

  let pausMenuList = [
    "resume",
    "Options",
    "help",
  ];

  let menuText = [
    pausMenuList,
  ];
 
  this.draw = function () {
    /*drawImage(
        "LOGO",
        itemsX,
        topItemY + this.cursor * rowHeight - 30
      );*/
      for (let i = 0; i < menuText[current].length; i++) {
        colorRect(topItemY, itemsX - 30 + rowHeight *i, itemsWidth, 30, 'green');
        colorText(
          menuText[current][i],
          itemsX,
          topItemY + rowHeight * i,
          50,
          "yellow"
        );
    }
  }

  this.update = function () {

    // Position arrow at last option on screen
    if (this.cursor < 0) {
      this.cursor = pausMenuList[current].length - 1;
    }

    // Position arrow at first option on screen
    if (this.cursor >= pausMenuList[current].length) {
      this.cursor = 0;
    }
  }
});