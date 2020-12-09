var enemyList = 
[

    {
        type: 'turtle',//never change this or levels may break
        LvlEditorImgName: 'theUnderturtler',//A single image of the enemy in a 48x48px image
        sprite: 'turtleEnemy',
        isImgSideview: false,
        health: 18,
        speed: 1.5,
        coins: 30,
        r: 15, //collisionbox
        ability: ['immuneToSlowdown']     
    },

    {
        type: 'ant',//never change this or levels may break
        LvlEditorImgName: 'ant',//A single image of the enemy in a 48x48px image
        sprite: 'AntEnemy',
        isImgSideview: true,
        health: 10,
        speed: 4,
        coins: 50,  
        r: 15, //collisionbox
        ability: []     
    },

];