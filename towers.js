class towerClass {
    constructor(current_index, tower_id) {
        this.currentIndex = current_index;
        this.tower_id = tower_id;
    }
    update() {

    }
    display() {

    }
}

function clickToPlaceTower(x,y){
	let layout = global_data[`level${currentLevel}`]["layout"]
	let index = positionToIndex([y,x],layout);
    let price_selected_tower = assets["towers"][selectedTower]["price"];
    if(
        layout[index[0]][index[1]] === 0
        && currentMoney >= price_selected_tower
    ){
        global_data['level1']['layout'][index[0]][index[1]] = selectedTower;
        currentMoney -= price_selected_tower;
    }
}

function updateTowers(){
	// for every case of the grid, display the tower according to its name in the global layout
	let layout = global_data[`level${currentLevel}`]["layout"];
	let towers = global_data[`level${currentLevel}`]["towersAvailable"];
    for(var i = 0; i < layout.length; i++){
        for(var j = 0; j < layout[i].length; j++){
			for(let tower of towers){
                if(layout[i][j] instanceof towerClass){
                    let one_tower = layout[i][j];
                    one_tower.display();
                }

				if(layout[i][j] === tower){

					let rect_x = indexToPosition([i,j],layout)[1]-(canvasWidth /layout[0].length)/2.3;
					let rect_y = indexToPosition([i,j],layout)[0]-(canvasHeight/layout[0].length)/2.3;
					let end_x = (canvasWidth/layout[0].length)/1.15;
					let end_y = (canvasHeight/layout[0].length)/1.15;
					image(towers_assets[`${tower}`], rect_x, rect_y, end_x, end_y);
				}
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
            let line_end_x = indexToTopRightHandCornerPostion([i+1,1],layout)[1]-4
            let line_end_y = indexToTopRightHandCornerPostion([i+1,1],layout)[0]
            strokeWeight(1);
            line(line_start_x, line_start_y, line_end_x, line_end_y);
            // image
			let rect_x = indexToPosition([i+1,0],layout)[1]-(canvasWidth /layout[0].length)/2.3;
			let rect_y = indexToPosition([i+1,0],layout)[0]-(canvasHeight/layout[0].length)/2.3;
			let end_x = (canvasWidth/layout[0].length)/1.15;
			let end_y = (canvasHeight/layout[0].length)/1.15;
			image(towers_assets[`${tower}`], rect_x, rect_y, end_x, end_y);
            // price
            fill(240,153,24);
            noStroke();
            textSize(9.5);
            text(
                assets["towers"][tower]["price"]+'$', 
                (indexToPosition([i+1,1],layout)[1]-(canvasWidth /layout[0].length)/2.3)+end_x/2-30, 
                (indexToPosition([i+1,1],layout)[0]-(canvasHeight/layout[0].length)/2.3)+end_y-3
            );
            // description
            fill(100);
            noStroke();
            textSize(9.5);
            text(
                assets["towers"][tower]["desc"],
                (indexToPosition([i+1,1],layout)[1]-(canvasWidth /layout[0].length)/2.3)+end_x/2-30,
                (indexToPosition([i+1,1],layout)[0]-(canvasHeight/layout[0].length)/2.3)+end_y-49
            );
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

function returnNearestEnemyInRange(range, x, y){
    let enemies = global_data[`level${currentLevel}`]["enemies"];
    let enemy_in_range = null;
    let min_distance = range;
    for(let enemy of enemies){
        let distance = Math.sqrt(Math.pow(enemy[0]-x,2)+Math.pow(enemy[1]-y,2));
        if(distance < range && distance < min_distance){
            enemy_in_range = enemy;
            min_distance = distance;
        }
    }
    return enemy_in_range;
}

