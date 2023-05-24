// game variables
let canvasWidth = 700;
let canvasHeight = 700;
let currentLevel = "1";
let currentMoney = 2000 
let currentHealth = 100;
let gameBoard;
let currentWave = 0;
let gameover = false;
let selectedTower = 't1';
let tower_panel_opened = false;
let levelsWon = [];

assets = {
	"enemies" : {
		"e1" : {"life" : 100, "color" : [255, 0, 0]  , "speed" : 1},
		"e2" : {"life" : 200, "color" : [0, 106, 255], "speed" : 5},
		"e3" : {"life" : 500, "color" : [255, 0, 0]  , "speed" : 6},
		"e4" : {"life" : 100, "color" : [255, 0, 0]  , "speed" : 5},
		"e5" : {"life" : 10 , "color" : [0, 106, 255], "speed" : 4}
	},
	"towers" : {
		"t1" : {"price" : 100 , "title" : "Arc"     ,"range" : 1.5, "fireRate" : 30, "bulletSpeed" : 10, "bullet" : "tw1", "damage" : 50 },
		"t2" : {"price" : 200 , "title" : "Archer"  ,"range" : 4  , "fireRate" : 30, "bulletSpeed" : 3 , "bullet" : "tw2", "damage" : 100},
		"t3" : {"price" : 500 , "title" : "Canon"   ,"range" : 2  , "fireRate" : 30, "bulletSpeed" : 10, "bullet" : "tw3", "damage" : 100},
		"t4" : {"price" : 1000, "title" : "Minigun" ,"range" : 2  , "fireRate" : 30, "bulletSpeed" : 10, "bullet" : "tw4", "damage" : 100},
		"t5" : {"price" : 2000, "title" : "RocketX" ,"range" : 2  , "fireRate" : 30, "bulletSpeed" : 10, "bullet" : "tw5", "damage" : 100}
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
		"bulletsTravelling" : [],
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
	bullets_assets = {};
	let towers_this_level = global_data[`level${currentLevel}`]["towersAvailable"];
	for(let tower of towers_this_level){
		let bullet_current_tower = assets["towers"][`${tower}`]["bullet"];
		towers_assets[`${tower}`] = loadImage(`./assets/towers/${tower}.png`);
		bullets_assets[`${bullet_current_tower}`] = loadImage(`./assets/bullets/${bullet_current_tower}.png`);
	}

	tower_panel = loadImage('./assets/selection_panel.png');
	play_button = loadImage('./assets/play_button.png');
	range_icon = loadImage('./assets/range_icon.png');
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

	updateBullets();

	
	// Artifically add an enemy
	var button = createButton('+1 Enemy');
	button.position(600, 650);
	button.mousePressed(addEnemyButton);

	// clear enemies
	var button = createButton('Clear Enemies');
	button.position(600, 600);
	button.mousePressed(clearEnemiesButton);
	
	displayGrid(global_data[`level${currentLevel}`]["layout"]);

	drawResources();
	displayWaveInterface();
	wavesEndDetection();

	let nb_enemies = global_data[`level${currentLevel}`]["enemiesAlive"].length;
	// let layout = global_data[`level${currentLevel}`]["layout"];
	// for(let i = 0;i<layout.length; i++){
	// 	console.log(layout[i])
	// }
	// console.log('----------------')
	
	// console.log(mouseX, mouseY);
}