const DEBUG = false;

// game variables
let canvasWidth = 700;
let canvasHeight = 700;
let currentView = "startMenu";
let currentLevel = '1';
let currentMoney;
let currentHealth = 5;
let gameBoard;
let currentWave = 0;
let selectedTower = 't1';
let tower_panel_opened = false;
let assets;
let redFlashFrameCount = 0;
let redFlashToggle = false;

assets = {
	"enemies" : {
		"e1" : {"life" : 100 , "color" : [0  , 255, 255], "speed" : 1   , "moneyWhenKilled" : 30 },
		"e2" : {"life" : 200 , "color" : [187, 255, 0  ], "speed" : 1   , "moneyWhenKilled" : 50 },
		"e3" : {"life" : 200 , "color" : [255, 0  , 0  ], "speed" : 2   , "moneyWhenKilled" : 70 },
		"e4" : {"life" : 75  , "color" : [0  , 106, 255], "speed" : 3   , "moneyWhenKilled" : 100},
		"e5" : {"life" : 1000, "color" : [0  , 0  , 0  ], "speed" : 0.75, "moneyWhenKilled" : 300}
    },
	"towers" : {
		"t1" : {"price" : 150 , "title" : "Lance-\nPierre", "range" : 1.5 , "fireRate" : 30, "bulletSpeed" : 7 , "bullet" : "tw1", "damage" : 80 },
		"t2" : {"price" : 200 , "title" : "Archer"        , "range" : 4   , "fireRate" : 55, "bulletSpeed" : 10, "bullet" : "tw2", "damage" : 190},
		"t3" : {"price" : 500 , "title" : "Canon"         , "range" : 2.5 , "fireRate" : 75, "bulletSpeed" : 20, "bullet" : "tw3", "damage" : 250},
		"t4" : {"price" : 800 , "title" : "Minigun"       , "range" : 1.75, "fireRate" : 4 , "bulletSpeed" : 10, "bullet" : "tw4", "damage" : 20 },
		"t5" : {"price" : 2000, "title" : "RocketX"       , "range" : 6   , "fireRate" : 50, "bulletSpeed" : 4 , "bullet" : "tw5", "damage" : 500}
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
			"1" : { "enemies" : { "e1" : 5 } },
			"2" : { "enemies" : { "e1" : 3, "e2" : 3} },
			"3" : { "enemies" : { "e1" : 2, "e2" : 2 , "e3" : 4} },
			"4" : { "enemies" : { "e1" : 7, "e2" : 5, "e3" : 1} },
			"5" : { "enemies" : { "e3" : 3, "e4" : 5} },
			"6" : { "enemies" : { "e2" : 10, "e3" : 5, "e4" : 2} },
			"7" : { "enemies" : { "e1" : 30, "e5" : 5} },
			"8" : { "enemies" : { "e2" : 20, "e3" : 10, "e4" : 5, "e5" : 7} }
		},
		"startingMoney" : 400,
		"levelAlreadyWon" : false 
	}
};

function preload() {
	currentLevelImg = loadImage(`./assets/levels/level${currentLevel}.png`);
	font = loadFont('./assets/font.ttf');

	levelsAvailable = [];
	for(let level in global_data){
		levelsAvailable.push(level);
	}

	towers_assets = {};
	bullets_assets = {};
	let towers_this_level = global_data[`level${currentLevel}`]["towersAvailable"];
	for(let tower of towers_this_level){
		let bullet_current_tower = assets["towers"][`${tower}`]["bullet"];
		towers_assets[`${tower}`] = loadImage(`./assets/towers/${tower}.png`);
		bullets_assets[`${bullet_current_tower}`] = loadImage(`./assets/bullets/${bullet_current_tower}.png`);
	}

	play_button = loadImage('./assets/play_button.png');
	home_menu_button = loadImage('./assets/home_menu_button.png');
	tower_panel = loadImage('./assets/selection_panel.png');
	start_wave_button = loadImage('./assets/start_wave_button.png');
	range_icon = loadImage('./assets/range_icon.png');

	startMenu = loadImage('./assets/backgrounds/startMenu.png');
	gameLost = loadImage('./assets/backgrounds/gameLost.png');
	gameWon = loadImage('./assets/backgrounds/gameWon.png');
	select_levels_panel = loadImage('./assets/select_levels_panel.png');
}

function setup() {
	frameRate(60);
	createCanvas(canvasWidth, canvasHeight);
}

function draw() {
	switch (currentView) {
		case "startMenu": 	{ startMenu_tick();	  break; }
		case "levelSelect": { levelSelect_tick(); break; }
		case "level": 		{ inGame_tick();	  break; }
		case "gameLost": 	{ gameLost_tick();	  break; }
		case "gameWon": 	{ gameWon_tick(); 	  break; }
		default: 			{ throw new Error("Invalid view"); }
	}
}