class bulletClass{
    constructor(current_index, tower_id, rotation) {
        let layout = global_data[`level${currentLevel}`]["layout"];
        this.currentIndex = current_index;
        this.tower_id = tower_id;
        this.rotation = rotation;
        this.rect_x = indexToPosition(this.currentIndex,layout)[1]-(canvasWidth /layout[0].length)/2.3;
        this.rect_y = indexToPosition(this.currentIndex,layout)[0]-(canvasHeight/layout[0].length)/2.3;
        this.width_x = (canvasWidth/layout[0].length)/1.15;
        this.height_y = (canvasHeight/layout[0].length)/1.15;
        this.img = bullets_assets[`${this.tower_id}`];
        this.speed = assets["towers"][this.tower_id]["bulletSpeed"];
        this.centerX = this.rect_x + this.width_x/2;
        this.centerY = this.rect_y + this.height_y/2;
        this.nearestEnemy = returnNearestEnemyInRange(this.pixel_range, this.centerX, this.centerY);
        this.targetX = this.nearestEnemy.currentPosX;
        this.targetY = this.nearestEnemy.currentPosY;
        this.dx = this.targetX - this.centerX;
        this.dy = this.targetY - this.centerY;
        this.distanceToTarget = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.velocityX = (this.dx / this.distanceToTarget) * this.speed;
        this.velocityY = (this.dy / this.distanceToTarget) * this.speed;
        this.hit = false;
    }
    update() {
        this.centerX += this.velocityX;
        this.centerY += this.velocityY;
        if(this.distanceToTarget < this.speed){
            this.hit = true;
            this.nearestEnemy.health -= assets["towers"][this.tower_id]["damage"];
        }
        //rotation
        this.rotation = Math.atan2(this.velocityY, this.velocityX) + radians(90);
    }
    display() {
        displayWithRotation(this.img, this.centerX, this.centerY, this.width_x, this.height_y, this.rotation);
    }
}

function updateBullets(){
    // for every bullet, update and display it
    let bullets = global_data[`level${currentLevel}`]["bulletsTravelling"];
    for(let i = 0; i < bullets.length; i++){
        let one_bullet = bullets[i];
        one_bullet.display();
        one_bullet.update();
    }
}