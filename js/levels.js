var levelList = [
    {
        levelName: 'testOne',
        mapName: 'test2',
        wave: [
            //wave 1
            {
                waitForPreviousWave: false,
                startDelay: 0,
                spawnOnPath: 0,
                strength: 5,
                amount: 20,
                delayBetweenSpawn: 5,
            },

            //wave 2
            {
                waitForPreviousWave: true,
                startDelay: 0,
                spawnOnPath: 1,
                strength: 5,
                amount: 30,
                delayBetweenSpawn: 3,
            },

            //wave 2
            {
                waitForPreviousWave: false,
                startDelay: 0,
                spawnOnPath: 2,
                strength: 5,
                amount: 10,
                delayBetweenSpawn: 10,
            },

            //wave 3
            {
                waitForPreviousWave: false,
                startDelay: 0,
                spawnOnPath: 0,
                strength: 5,
                amount: 20,
                delayBetweenSpawn: 7,
            },
        ]
    }

    
];