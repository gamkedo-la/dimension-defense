var enemyList = 
[

    {
        type: 'turtle',//never change this or levels may break
        LvlEditorImgName: 'turtleSingle',//A single image of the enemy in a 48x48px image
        sprite: 'turtleEnemy',
        isImgSideview: false,
        health: 18,
        speed: 1.5,
        coins: 40,
        r: 15, //collisionbox
        ability: ['immuneToSlowdown']     
    },

    {
        type: 'ant',//never change this or levels may break
        LvlEditorImgName: 'antSingle',//A single image of the enemy in a 48x48px image
        sprite: 'AntEnemy',
        isImgSideview: true,
        health: 10,
        speed: 2.5,
        coins: 50,  
        r: 15, //collisionbox
        ability: []     
    },

    {
        type: 'car',//never change this or levels may break
        LvlEditorImgName: 'carSingle',//A single image of the enemy in a 48x48px image
        sprite: 'CarEnemy',
        isImgSideview: false,
        health: 18,
        speed: 4,
        coins: 30,
        r: 15, //collisionbox
        ability: []     
    },

];