function mousePressed() {
	// Place tower
	if (!tower_panel_opened) { clickToPlaceTower(mouseX,mouseY) };
    // open tower panel
    if(mouseX > 15 && mouseY > 5 && mouseX < 59 && mouseY < 43 && !tower_panel_opened){ switchTowerPanel(); }
    // close tower panel
    if(mouseX > 113 && mouseY > 47 && mouseX < 135 && mouseY < 71 && tower_panel_opened){ switchTowerPanel(); }
    // select tower
    if(tower_panel_opened){ 
        let layout = global_data[`level${currentLevel}`]["layout"];
        let towers = global_data[`level${currentLevel}`]["towersAvailable"];
        let nb_towers = towers.length;
        for(let i = 0; i < nb_towers; i++){
            if(
                mouseX < indexToBottomRightHandCornerPostion([i+1,1],layout)[1]
                && mouseY < indexToBottomRightHandCornerPostion([i+1,1],layout)[0]
                && mouseX > indexToTopLeftHandCornerPostion([i+1,0],layout)[1]
                && mouseY > indexToTopLeftHandCornerPostion([i+1,0],layout)[0]
            ){
                selectedTower = towers[i];
                tower_panel_opened = false;
            }
        }
    }
    // start or skip wave
    let nb_waves = Object.keys(global_data[`level${currentLevel}`]["waves"]).length;
    if(
        mouseX > 595 && mouseY > 0 && mouseX < 638 && mouseY < 33
        && (nb_waves != currentWave)
    ){
        currentWave += 1;
        waveSpawnEnemies();
    }
}

function displayGrid(layout) {
	// Draw the game board using rectangles or images
	let caseSize = canvasHeight / layout.length;
	for(let i = 0; i < layout.length; i++){
		for(let j = 0; j < layout[i].length; j++){
			// only when nearby : tower placing
			if(mouseX < indexToPosition([i,j],layout)[0] + (canvasWidth/layout.length)/2 
			&& mouseX > indexToPosition([i,j],layout)[0] - (canvasWidth/layout.length)/2 
			&& mouseY < indexToPosition([i,j],layout)[1] + (canvasWidth/layout.length)/2 
			&& mouseY > indexToPosition([i,j],layout)[1] - (canvasWidth/layout.length)/2){
				if(layout[j][i] == 0 && !tower_panel_opened){
					noFill();
					stroke(255, 255, 255, 200);
					strokeWeight(3);
					rect(i*caseSize, j*caseSize, caseSize, caseSize, 10)
				}
			}
		}
	}
}

function drawResources() {
	fill(0);
	stroke(255);
	textSize(18);
	textFont(font);
	text("Level " + currentLevel, (canvasWidth/2)-40, 25);
	textSize(12);
	text(currentMoney, 180, 23);
	text(currentHealth, 110, 23);
}

function indexToPosition(index,layout) {
    nombreDeCasesX=layout[0].length;
    nombreDeCasesY=layout.length;
    for(let i=0; i<layout.length;i++){
        for(let j=0; j<layout.length;j++){
            ligne = index[0];
            colonne = index[1];
            let x = (ligne + 0.5) * canvasWidth/nombreDeCasesY;
            let y = (colonne + 0.5) * canvasWidth/nombreDeCasesX; 
            return( [x,y] );
        }
    }
}

function positionToIndex(position,layout) {
    nombreDeCasesX=layout[0].length;
    nombreDeCasesY=layout.length;
    for(let i=0; i<layout.length;i++){
        for(let j=0; j<layout.length;j++){
            let x = position[0];
            let y = position[1];
            let indexX = Math.floor(x/(canvasWidth/nombreDeCasesX));
            let indexY = Math.floor(y/(canvasWidth/nombreDeCasesY));
            return( [indexX,indexY] );
        }
    }
}

function findClosestPath(layout, startX, startY) {
	const queue = [{ x: startX, y: startY, dist: 0 }];
	const visited = new Set();
	visited.add(`${startX},${startY}`);
  
	while (queue.length > 0) {
	    const { x, y, dist } = queue.shift();

        // verify if layout is defined
        if(layout[x] == undefined || layout[y] == undefined){
            return "RI2";
        }
  
	    // Check if we've found a path
        if (layout[x][y] === undefined || layout[x][y] === 1 || layout[x][y] === 4) {
            return { x, y, dist};
        }
  
        // Add unvisited neighbors to the queue
        const neighbors = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
        ];
        for (const neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (
            neighbor.x >= 0 &&
            neighbor.x < layout.length &&
            neighbor.y >= 0 &&
            neighbor.y < layout[0].length &&
            layout[neighbor.x][neighbor.y] !== 0 &&
            !visited.has(key)
            ) {
            queue.push({ ...neighbor, dist: dist + 1 });
            visited.add(key);
            }
        }
    }
    
    // No path found
    return "RI1";
}

function findOnlyIndex(layout,value) {
	for(let i = 0; i < layout.length; i++) {
		for(let j = 0; j < layout[i].length; j++) {
			if(layout[i][j] == value) {
				return [j,i];
			}
		}
	}
	return null;
}

function compareArrays(arr1, arr2) {
    // check if arrays are defined
    if(arr1 == undefined || arr2 == undefined){
        return false;
    }
	// compare length
	if (arr1.length !== arr2.length) {
	  return false;
	}
  
	// compare each element
	for (let i = 0; i < arr1.length; i++) {
	  if (arr1[i] !== arr2[i]) {
		return false;
	  }
	}
  
	return true;
}

function indexToTopLeftHandCornerPostion(index,layout) {
    nombreDeCasesX=layout[0].length;
    nombreDeCasesY=layout.length;
    for(let i=0; i<layout.length;i++){
        for(let j=0; j<layout.length;j++){
            ligne = index[0];
            colonne = index[1];
            let x = (colonne) * canvasWidth/nombreDeCasesX;
            let y = (ligne) * canvasWidth/nombreDeCasesY;
            return([y, x]);
        }
    }
}

function indexToTopRightHandCornerPostion(index,layout) {
    nombreDeCasesX=layout[0].length;
    nombreDeCasesY=layout.length;
    for(let i=0; i<layout.length;i++){
        for(let j=0; j<layout.length;j++){
            ligne = index[0];
            colonne = index[1];
            let x = (colonne+1) * canvasWidth/nombreDeCasesX;
            let y = (ligne) * canvasWidth/nombreDeCasesY;
            return([y, x]);
        }
    }
}

function indexToBottomRightHandCornerPostion(index,layout) {
    nombreDeCasesX=layout[0].length;
    nombreDeCasesY=layout.length;
    for(let i=0; i<layout.length;i++){
        for(let j=0; j<layout.length;j++){
            ligne = index[0];
            colonne = index[1];
            let x = (colonne+1) * canvasWidth/nombreDeCasesX;
            let y = (ligne+1) * canvasWidth/nombreDeCasesY;
            return([y, x]);
        }
    }
}

function approxEqual(a, b, precision) {
    return Math.abs(a - b) < precision;
  }

function addEnemyButton() {
	spawnEnemy("e5");
}

function clearEnemiesButton() {
    let level = Object.assign({}, global_data["level1"]);
    level['enemiesAlive'] = [];
    global_data["level1"] = level;
}