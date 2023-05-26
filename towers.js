class towerClass {
    constructor(current_index, tower_id) {
        let layout = global_data[`level${currentLevel}`]["layout"];
        this.currentIndex = current_index;
        this.tower_id = tower_id;
        this.rect_x = indexToPosition(this.currentIndex,layout)[1]-(canvasWidth /layout[0].length)/2.3;
        this.rect_y = indexToPosition(this.currentIndex,layout)[0]-(canvasHeight/layout[0].length)/2.3;
        this.width_x = (canvasWidth/layout[0].length)/1.15;
        this.height_y = (canvasHeight/layout[0].length)/1.15;
        this.img = towers_assets[`${this.tower_id}`];
        this.rotation = 0;
        this.range = assets["towers"][this.tower_id]["range"];
        this.pixel_range = this.range * (canvasWidth/layout[0].length);
        this.centerX = this.rect_x + this.width_x/2;
        this.centerY = this.rect_y + this.height_y/2;
    }
    update() {
        // rotate to face nearest enemy
        this.nearestEnemy = returnNearestEnemyInRange(this.pixel_range, this.centerX, this.centerY);
        if( this.nearestEnemy != null){
            let dx = this.nearestEnemy.currentPosX - this.centerX;
            let dy = this.nearestEnemy.currentPosY - this.centerY;
            this.rotation = Math.atan2(dy, dx) + radians(90);
        }
        // shoot every x frames
        if(frameCount % assets["towers"][this.tower_id]["fireRate"] === 0){
            if(this.nearestEnemy != null){
                let one_bullet = new bulletClass(this.nearestEnemy, this.currentIndex, this.tower_id, this.rotation); 
                global_data[`level${currentLevel}`]["bulletsTravelling"].push(one_bullet);
            }
        }
        
    }
    display() {
        displayWithRotation(this.img, this.rect_x, this.rect_y, this.width_x, this.height_y, this.rotation);
        // draw range if mouse on tower and tower panel closed
        if(
               mouseX >= this.rect_x && mouseX <= this.rect_x + this.width_x
            && mouseY >= this.rect_y && mouseY <= this.rect_y + this.height_y
            && !tower_panel_opened
        ){
            // black transparent ellipse
            fill(0,0,0,50);
            stroke(0,0,0,100);
            strokeWeight(1);
            ellipse(this.centerX, this.centerY, this.pixel_range*2)
        }
    }
}

function clickToPlaceTower(x,y){
	let layout = global_data[`level${currentLevel}`]["layout"];
	let index = positionToIndex([y,x],layout);
    let price_selected_tower = assets["towers"][selectedTower]["price"];
    if(
        layout[index[0]][index[1]] === 0
        && currentMoney >= price_selected_tower
    ){
        global_data[`level${currentLevel}`]['layout'][index[0]][index[1]] = new towerClass(index, selectedTower);
        currentMoney -= price_selected_tower;
    }
}

function updateTowers(){
	// for every cell of the grid, update and display the tower according to its name in the global layout
	let layout = global_data[`level${currentLevel}`]["layout"];
    for(var i = 0; i < layout.length; i++){
        for(var j = 0; j < layout[i].length; j++){
            if(layout[i][j] instanceof towerClass){
                let one_tower = layout[i][j];
                one_tower.display();
                one_tower.update();
            }
        }
    }
}

function switchTowerPanel(){
	if(tower_panel_opened === true){
		tower_panel_opened = false;
	}else{
		tower_panel_opened = true;
	}
}

function displayTowerPanel(){
	if(tower_panel_opened){
		image(tower_panel, 0, 44, 139,519);
		fill(0);
		noStroke();
		textSize(9.5);
		textFont(font);
		text("Tower Selection", 1, 62);
        //cross to close the panel 
        stroke(0);
        strokeWeight(2);
        line(120, 53, 130, 63); 
        line(120, 63, 130, 53); 

		let layout = global_data[`level${currentLevel}`]["layout"];
		let towers = global_data[`level${currentLevel}`]["towersAvailable"];
		let nb_towers = towers.length
		for(let tower of towers){
			let i = tower[1]-1;
            //lign
            stroke(0);
            let line_start_x = indexToTopLeftHandCornerPostion([i+1,0],layout)[1]
			let line_start_y = indexToTopLeftHandCornerPostion([i+1,0],layout)[0]
            let line_width_x = indexToTopRightHandCornerPostion([i+1,1],layout)[1]-4
            let line_height_y = indexToTopRightHandCornerPostion([i+1,1],layout)[0]
            strokeWeight(1);
            line(line_start_x, line_start_y, line_width_x, line_height_y);
            // image
			let rect_x = indexToPosition([i+1,0],layout)[1]-(canvasWidth /layout[0].length)/2.3;
			let rect_y = indexToPosition([i+1,0],layout)[0]-(canvasHeight/layout[0].length)/2.3;
			let width_x = (canvasWidth/layout[0].length)/1.15;
			let height_y = (canvasHeight/layout[0].length)/1.15;
			image(towers_assets[`${tower}`], rect_x, rect_y, width_x, height_y);
            // price
            fill(240,153,24);
            noStroke();
            textSize(9.5);
            text(
                '$ '+assets["towers"][tower]["price"], 
                (indexToPosition([i+1,1],layout)[1]-(canvasWidth /layout[0].length)/2.3)+width_x/2-30, 
                (indexToPosition([i+1,1],layout)[0]-(canvasHeight/layout[0].length)/2.3)+height_y-3
            );
            // title
            fill(100);
            noStroke();
            textSize(9.5);
            text(
                assets["towers"][tower]["title"],
                (indexToPosition([i+1,1],layout)[1]-(canvasWidth /layout[0].length)/2.3)+width_x/2-30,
                (indexToPosition([i+1,1],layout)[0]-(canvasHeight/layout[0].length)/2.3)+height_y-48
            );
            // range
            fill(0,0,0,100);
            stroke(0,0,0,100);
            strokeWeight(1);
            image(
                range_icon, 
                (indexToPosition([i+1,1],layout)[1]-(canvasWidth /layout[0].length)/2.3)+width_x/2-30, 
                (indexToPosition([i+1,1],layout)[0]-(canvasHeight/layout[0].length)/2.3)+height_y-33, 
                13, 
                13
            );
            text(
                assets["towers"][tower]["range"],
                (indexToPosition([i+1,1],layout)[1]-(canvasWidth /layout[0].length)/2.3)+width_x/2-13,
                (indexToPosition([i+1,1],layout)[0]-(canvasHeight/layout[0].length)/2.3)+height_y-21.5
            )
            // greyed out under the line if not enough money
            if(currentMoney < assets["towers"][tower]["price"]){
                fill(0,0,0,100);
                stroke(0,0,0,100);
                strokeWeight(1);
                let width_greyed_out_x = indexToTopRightHandCornerPostion([i+1,1],layout)[1]-4
                let height_greyed_out_y = canvasHeight/layout[0].length
                rect(line_start_x, line_start_y, width_greyed_out_x,height_greyed_out_y);
            }
		}
	}
	else{
		if(selectedTower != null){
			fill(0);
			noStroke();
			textSize(10);
			textFont(font);
			text("Selected\n  Tower", 8, 55);
			//tower 4x smaller than the tower panel
			image(towers_assets[`${selectedTower}`], 20, 6, 34.75, 34.75);
		}
	}
}

function selectThisTower(tower){
    selectedTower = tower;
}

function returnNearestEnemyInRange(range, tower_x, tower_y){
    let enemies = global_data[`level${currentLevel}`]["enemiesAlive"];
    let enemy_in_range = null;
    let min_distance = range;
    for(let enemy in enemies){
        let one_enemy = enemies[enemy];
        // get x coordinate of the enemy, being an instance of the enemy class
        let enemy_x = one_enemy.currentPosX;
        let enemy_y = one_enemy.currentPosY;
        // distance between the tower and the enemy
        let distance = dist(tower_x, tower_y, enemy_x, enemy_y);
        if(distance < range && distance < min_distance){
            enemy_in_range = enemies[enemy];
            min_distance = distance;
        }
    }
    if(min_distance <= range){
        return enemy_in_range;
    }else{ return null }
}

function displayWithRotation(img, start_x, start_y, width_im, height_im, radianAngle){
    push();
    translate(start_x + width_im/2, start_y + height_im/2);
    rotate(radianAngle);
    translate(-start_x - width_im/2, -start_y - height_im/2);
    image(img, start_x, start_y, width_im, height_im);
    pop();
}