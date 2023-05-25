function startMenu_tick(){
    background(startMenu);
} 

function inGame_tick(){
    removeElements();

	background(currentLevelImg);
	
	updateEnemies();
	handleWaves();

	updateTowers();
	displayTowerPanel();

	updateBullets();

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

function gameLost_tick(){

}

function gameWon_tick(){

}
