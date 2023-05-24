class enemyClass {
    constructor(current_index, enemy_id) {
        this.index = current_index; 
        // init with the first grid position
        this.destinationPosX = indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[0];
        this.destinationPosY = indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[1];
        this.currentPosX;
        this.currentPosY;
        this.enemy_layout = [
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
        ]; 
        this.enemy_id = enemy_id;
        this.life =  assets["enemies"][enemy_id]["life"];
        this.speed = assets["enemies"][enemy_id]["speed"];
        this.color = assets["enemies"][enemy_id]["color"];
    }

    update() {
        // end of the path => destroy the enemy, remove a life
        if ( 
            compareArrays (
                positionToIndex([this.currentPosX,this.currentPosY],global_data[`level${currentLevel}`]["layout"]), 
                findOnlyIndex(this.enemy_layout, 4)
            )
        ) { 
            this.life = 0;
            this.destroy();
            currentHealth -= 1;
        }
        else {
            //init 
            if(this.currentPosX == undefined && this.currentPosY == undefined){
                this.currentPosX = this.destinationPosX; 
                this.currentPosY = this.destinationPosY;
                this.enemy_layout[this.index[1]][this.index[0]] = 2;
                this.index[1] = findClosestPath(this.enemy_layout, this.index[1], this.index[0])['x'];
                this.index[0] = findClosestPath(this.enemy_layout, this.index[1], this.index[0])['y'];
                this.destinationPosX = random(
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[0]-(canvasWidth/this.enemy_layout.length)/3, 
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[0]+(canvasWidth/this.enemy_layout.length)/3
                );
                this.destinationPosY = random(
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[1]-(canvasWidth/this.enemy_layout.length)/3, 
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[1]+(canvasWidth/this.enemy_layout.length)/3
                );
            }
            // if the enemy is not at the destination position, get closer
            if(
                !approxEqual(this.currentPosX, this.destinationPosX, 0.6) 
             && !approxEqual(this.currentPosY, this.destinationPosY, 0.6)
            ){
                this.currentPosX = this.currentPosX + (this.destinationPosX - this.currentPosX) * 0.1 * this.speed;
                this.currentPosY = this.currentPosY + (this.destinationPosY - this.currentPosY) * 0.1 * this.speed;
            }
            // if the enemy is at the destination position, update the destination position
            else{
                this.enemy_layout[this.index[1]][this.index[0]] = 2;
                this.index[1] = findClosestPath(this.enemy_layout, this.index[1], this.index[0])['x'];
                this.index[0] = findClosestPath(this.enemy_layout, this.index[1], this.index[0])['y'];
                this.destinationPosX = random(
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[0]-(canvasWidth/this.enemy_layout.length)/3, 
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[0]+(canvasWidth/this.enemy_layout.length)/3
                );
                this.destinationPosY = random(
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[1]-(canvasWidth/this.enemy_layout.length)/3, 
                    indexToPosition(this.index,global_data[`level${currentLevel}`]["layout"])[1]+(canvasWidth/this.enemy_layout.length)/3
                );
            }
        }
        if(this.life <= 0){
            this.destroy();
        }
    }

    display() {
        stroke(0); 
        strokeWeight(2);
        fill(this.color); 
        circle(this.currentPosX, this.currentPosY, 30); 
        // life bar 
        this.max_life = assets["enemies"][this.enemy_id]["life"];
        this.life_percentage = (this.life / this.max_life)*100;
        this.life_bar = map(this.life_percentage, 0, 100, 0, 30);
        stroke(0);
        strokeWeight(1);
        fill(0, 255, 0); // Green
        rect(this.currentPosX - 15, this.currentPosY - 25, this.life_bar, 5);

    }

    destroy() {
        // Remove the enemies from the array
        global_data[`level${currentLevel}`]["enemiesAlive"].splice(global_data[`level${currentLevel}`]["enemiesAlive"].indexOf(this), 1);
    }
}

// ------------------------------

function updateEnemies() {
	let enemies = global_data[`level${currentLevel}`]["enemiesAlive"];
	if (enemies.length !== 0) {
    	for (let i = 0; i < enemies.length; i++) {
			let one_enemy = enemies[i];
			one_enemy.update();
            one_enemy.display(); 
      	}
	}
}

function displayWaveInterface() {
    fill(0);
	stroke(255);
    textSize(12);
	textFont(font);
    text(`Wave ${currentWave}`, canvasWidth-canvasWidth/4.1, 23);
    let enemiesAlive = global_data[`level${currentLevel}`]["enemiesAlive"];
    if(enemiesAlive.length == 0){
        image(play_button, canvasWidth-canvasWidth/7.3, 10, 16,16);  
    }else{
        image(play_button, canvasWidth-canvasWidth/8, 10, 16,16);  
        image(play_button, canvasWidth-canvasWidth/7.3, 10, 16,16);  
    }
}

function handleWaves(){
    let waves = global_data[`level${currentLevel}`]["waves"];
    if(currentWave != 0){
        
    }
}

function spawnEnemy(enemy_id){
    let level = Object.assign({}, global_data[`level${currentLevel}`]);
	let enemy = new enemyClass(findOnlyIndex(level["layout"],3), enemy_id);
	level['enemiesAlive'].push(enemy);
	global_data[`level${currentLevel}`] = level;
}

function waveSpawnEnemies(){
    let current_wave = global_data[`level${currentLevel}`]["waves"][currentWave];
    if(current_wave != undefined){
        for(let enemy in current_wave["enemies"]){
            let nb_to_spawn = current_wave["enemies"][enemy];
            for (let i = 0; i < nb_to_spawn-1; i++) {
                spawnEnemy(enemy);
            }
        }
    }
}

function wavesEndDetection(){
    let waves = global_data[`level${currentLevel}`]["waves"];
    let enemiesAlive = global_data[`level${currentLevel}`]["enemiesAlive"];
    let nb_waves = Object.keys(waves).length;
    if(nb_waves == currentWave && enemiesAlive.length == 0){
        levelsWon.push(currentLevel);
        // currentLevel = "start";
        console.log('end of waves')
    }
}