var enemyList = 
[

    {
        type: 'turtle',//never change this or levels may break
        LvlEditorImgName: 'turtleSingle',//A single image of the enemy in a 48x48px image
        sprite: 'turtleEnemy',
        isImgSideview: false,
        health: 15,
        speed: 1.2,
        coins: 40,
        score: 100,
        r: 15, //collisionbox
        ability: ['immuneToSlowdown']     
    },

    {
        type: 'ant',//never change this or levels may break
        LvlEditorImgName: 'antSingle',//A single image of the enemy in a 48x48px image
        sprite: 'AntEnemy',
        isImgSideview: true,
        health: 8,
        speed: 2,
        coins: 50,
        score: 250,  
        r: 15, //collisionbox
        ability: []     
    },

    {
        type: 'car',//never change this or levels may break
        LvlEditorImgName: 'carSingle',//A single image of the enemy in a 48x48px image
        sprite: 'CarEnemy',
        isImgSideview: false,
        health: 6,
        speed: 2.5,
        coins: 30,
        score: 500,
        r: 15, //collisionbox
        ability: ['speedUpWhenElectrecuted']     
    },

];