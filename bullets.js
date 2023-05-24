class bulletClass{
    constructor(targetedEnemy, current_index, tower_id, rotation) {
        let layout = global_data[`level${currentLevel}`]["layout"];
        this.targetedEnemy = targetedEnemy;
        this.currentIndex = current_index;
        this.tower_id = tower_id;
        this.bullet_id = `tw${this.tower_id.slice(-1)}`;
        this.rotation = rotation;

        this.rect_x = indexToPosition(this.currentIndex,layout)[1]-(canvasWidth /layout[0].length)/2.3;
        this.rect_y = indexToPosition(this.currentIndex,layout)[0]-(canvasHeight/layout[0].length)/2.3;
        this.width_x = (canvasWidth/layout[0].length)/1.15;
        this.height_y = (canvasHeight/layout[0].length)/1.15;
        this.centerX = this.rect_x + this.width_x/2;
        this.centerY = this.rect_y + this.height_y/2;

        this.img = bullets_assets[this.bullet_id];
        this.speed = assets["towers"][this.tower_id]["bulletSpeed"];
        this.targetX = this.targetedEnemy.currentPosX;
        this.targetY = this.targetedEnemy.currentPosY;

        this.dx = this.targetX - this.centerX;
        this.dy = this.targetY - this.centerY;
        this.distanceToTarget = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.velocityX = (this.dx / this.distanceToTarget) * this.speed;
        this.velocityY = (this.dy / this.distanceToTarget) * this.speed;
    }
    update() {
        // move bullet towards enemy
        this.targetX = this.targetedEnemy.currentPosX;
        this.targetY = this.targetedEnemy.currentPosY;
        this.dx = this.targetX - this.centerX;
        this.dy = this.targetY - this.centerY;
        this.distanceToTarget = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.velocityX = (this.dx / this.distanceToTarget) * this.speed;
        this.velocityY = (this.dy / this.distanceToTarget) * this.speed;
        this.centerX += this.velocityX;
        this.centerY += this.velocityY;
        if(this.distanceToTarget < 30){
            this.targetedEnemy.life -= assets["towers"][this.tower_id]["damage"];
            if(this.targetedEnemy.life <= 0){ 
                currentMoney += assets["enemies"][this.targetedEnemy.enemy_id]["moneyWhenKilled"];
            }
            this.destroy();
        }
        if(this.targetedEnemy.life <= 0){ this.destroy() }
        
        //rotation
        this.rotation = Math.atan2(this.velocityY, this.velocityX) + radians(90);
    }
    display() {
        // ellipse(this.centerX, this.centerY, 10, 10);
        let bulletStartX = this.centerX - this.width_x/2;
        let bulletStartY = this.centerY - this.height_y/2;
        displayWithRotation(this.img, bulletStartX, bulletStartY, this.width_x, this.height_y, this.rotation);
    }
    destroy() {
        let bullets = global_data[`level${currentLevel}`]["bulletsTravelling"];
        let index = bullets.indexOf(this);
        bullets.splice(index, 1);
        global_data[`level${currentLevel}`]["bulletsTravelling"] = bullets;
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

