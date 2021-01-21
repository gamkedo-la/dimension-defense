var enemyList = 
[

    {
        type: 'turtle',//never change this or levels may break
        LvlEditorImgName: 'turtleSingle',//A single image of the enemy in a 48x48px image
        sprite: 'turtleEnemy',
        isImgSideview: false,
        health: 100,
        speed: 1.2,
        coins: 200,
        score: 1000,
        r: 15, //collisionbox
        ability: ['immuneToSlowdown']     
    },

    {
        type: 'ant',//never change this or levels may break
        LvlEditorImgName: 'antSingle',//A single image of the enemy in a 48x48px image
        sprite: 'AntEnemy',
        isImgSideview: true,
        health: 60,
        speed: 2.5,
        coins: 125,
        score: 250,  
        r: 15, //collisionbox
        ability: []     
    },

    {
        type: 'car',//never change this or levels may break
        LvlEditorImgName: 'carSingle',//A single image of the enemy in a 48x48px image
        sprite: 'CarEnemy',
        isImgSideview: false,
        health: 40,
        speed: 3,
        coins: 150,
        score: 400,
        r: 15, //collisionbox
        ability: ['speedUpWhenElectrecuted']     
    },

    {
        type: 'blob',//never change this or levels may break
        LvlEditorImgName: 'blobSingle',//A single image of the enemy in a 48x48px image
        sprite: 'BlobEnemy',
        isImgSideview: true,
        health: 30,
        speed: 2,
        coins: 100,
        score: 300,
        r: 15, //collisionbox
        ability: []     
    },

];