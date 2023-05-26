function startMenu_tick(){
    background(startMenu);
    showInterfaceButton(play_button)
} 

function levelSelect_tick(){
    background(startMenu);
    image(select_levels_panel, 46.5, 46.5, 607, 607);
    let i = 0;
    for(let level in levelsAvailable){
        //index of the level 
        i = parseInt(level) + 1;
        let lign_start_x = 49.5;
        let lign_start_y = 120*i - (i-1)*50;
        let lign_end_x = 650.5;
        let lign_end_y = lign_start_y;
        stroke(0);
        line(lign_start_x, lign_start_y, lign_end_x, lign_end_y);
        // level Title, font
        fill(0);
        noStroke();
        textSize(16);
        textFont(font);
        text(`Level ${i}`, 75, 120*i - (i-1)*50 +42);
        // number of waves
        textSize(12);
        textFont(font);
        let nb_waves = Object.keys(global_data[`level${i}`]["waves"]).length;
        fill(100);
        text(`Waves: ${nb_waves}`, 200, 120*i - (i-1)*50 +42);
        // click to play this level
        if(mouseX > 50 && mouseY > 120*i - (i-1)*50 && mouseX < 650 && mouseY < 120*i - (i-1)*50 + 70){ 
            fill(0, 0, 0, 50);
            rect(49, 120*i - (i-1)*50, 602, 70);
            if(mouseIsPressed){
                currentLevel = i.toString();
                startLevel();
                currentView = "level";
            }
        }
        // show 'Level won : true' if level already won (with true in green and false in red)
        text(`Level won :`, 475, 120*i - (i-1)*50 +42);
        let won = global_data[`level${i}`]["levelAlreadyWon"];
        if (won) { fill(0, 255, 0) } else { fill(255, 0, 0) }
        textSize(12);
        textFont(font);
        text(`${won}`, 578, 120*i - (i-1)*50 +43);



        

    }
    // last lign
    i++;
    let lign_start_x = 49.5;
    let lign_start_y = 120*i - (i-1)*50;
    let lign_end_x = 650.5;
    let lign_end_y = 120*i - (i-1)*50;
    stroke(0);
    line(lign_start_x, lign_start_y, lign_end_x, lign_end_y);
}

function inGame_tick(){
    handleGameLost();
    removeElements();

	background(currentLevelImg);
	
	updateEnemies();

	updateTowers();
	displayTowerPanel();

	updateBullets();

	displayGrid();
    
	drawResources();
	displayWaveInterface();
	wavesEndDetection();
    redFlashes(8);
    if (DEBUG) {
        // Artifically add an enemy
        var button = createButton('+1 Enemy');
        button.position(600, 650);
        button.mousePressed(addEnemyButton);

        // clear enemies
        var button = createButton('Clear Enemies');
        button.position(600, 600);
        button.mousePressed(clearEnemiesButton);
	}
}

function gameLost_tick(){
    background(gameLost);
    showInterfaceButton(home_menu_button);
    if(mouseX > 219 && mouseY > 574 && mouseX < 473 && mouseY < 629){ 
        if(mouseIsPressed){
            currentView = "startMenu";
        }
    }
}

function gameWon_tick(){
    background(gameWon);
    showInterfaceButton(home_menu_button);
    // Display Level {currentLevel} won ! 
    fill(255);
    noStroke();
    textSize(32);
    textFont(font);
    text(`Level ${currentLevel} won !`, 200, 300)
    // button
    if(mouseX > 219 && mouseY > 574 && mouseX < 473 && mouseY < 629){ 
        if(mouseIsPressed){
            currentView = "startMenu";
        }
    }
}