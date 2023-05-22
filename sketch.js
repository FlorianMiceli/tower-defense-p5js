// game variables
let canvasWidth = 700;
let canvasHeight = 700;
let currentLevel = "1";
let currentMoney = 50000 
let currentHealth = 100;
let gameBoard;
let currentWave = 0;
let gameover = false;
let selectedTower = 't1';
let tower_panel_opened = false;
let levelsWon = [];

assets = {
	"enemies" : {
		"e1" : {"life" : 100, "color" : [255, 0, 0], "speed" : 1},
		"e2" : {"life" : 200, "color" : [0, 106, 255], "speed" : 5},
		"e3" : {"life" : 500, "color" : [255, 0, 0], "speed" : 6},
		"e4" : {"life" : 100, "color" : [255, 0, 0], "speed" : 5},
		"e5" : {"life" : 10 , "color" : [0, 106, 255], "speed" : 4}
	},
	"towers" : {
		"t1" : {"price" : 100,  "desc" : "Test"},
		"t2" : {"price" : 200,  "desc" : "Test"},
		"t3" : {"price" : 500,  "desc" : "Canon"},
		"t4" : {"price" : 1000, "desc" : "Test"},
		"t5" : {"price" : 2000, "desc" : "Test"}
	}
}

global_data = {
    "level1" : 
        {
        "layout": [
            [2,2,2,2,2,2,2,2,2,2],
            [2,0,1,1,1,1,1,1,1,3],
            [2,0,1,0,0,0,0,0,0,2],
            [2,0,1,0,0,0,0,0,0,2],
            [2,0,1,1,1,1,1,1,0,2],
            [2,2,0,0,0,0,0,1,0,2],
            [2,2,0,0,0,0,0,1,0,2],
            [2,2,0,0,0,0,0,1,0,2],
            [4,1,1,1,1,1,1,1,0,2],
            [2,2,2,2,2,2,2,2,2,2]
        ],
        "background": "level1.png",
        "enemiesAlive" : [],
		"towersPlaced" : [],
		"towersAvailable" : ["t1", "t2", "t3", "t4", "t5"],
		"waves" : {
			"1" : { "enemies" : { "e2" : 5 , "e3" : 3} },
			"2" : { "enemies" : { "e2" : 10, "e3" : 5} },
			"3" : { "enemies" : { "e2" : 20, "e3" : 15, "e4" : 500} },
		}
	}
};

function preload() {
	backgroundImage = loadImage(`./levels/level${currentLevel}.png`);
	font = loadFont('./assets/font.ttf');

	towers_assets = {};
	let towers_this_level = global_data[`level${currentLevel}`]["towersAvailable"];
	for(let tower of towers_this_level){
		towers_assets[`${tower}`] = loadImage(`./assets/towers/${tower}.png`);
	}

	tower_panel = loadImage('./assets/selection_panel.png');
	play_button = loadImage('./assets/play_button.png');
}

function setup() {
	frameRate(60);
	createCanvas(canvasWidth, canvasHeight);

	// Spawn enemies
	for(let i = 0; i<5; i++){
		spawnEnemy("e1");
	}
}

function draw() {
	removeElements();

	background(backgroundImage);

	
	updateEnemies();
	handleWaves();

	updateTowers();
	displayTowerPanel();
	
	// Artifically add an enemy
	var button = createButton('+1 Enemy');
	button.position(600, 650);
	button.mousePressed(addEnemyButton);

	// clear enemies
	var button = createButton('Clear Enemies');
	button.position(600, 600);
	button.mousePressed(clearEnemiesButton);
	
	// Draw grid
	displayGrid(global_data[`level${currentLevel}`]["layout"]);
	// Draw HUD elements
	drawResources();
	displayWaveInterface();
	wavesEndDetection();
	
	// console.log(mouseX, mouseY);
}