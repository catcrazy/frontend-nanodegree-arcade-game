goog.require('goog.array');

/** 
* Super Class for the Elements on the canvas
* @constructor 
* @param {number} x Initial location x-asis
* @param {number} y Initial location y-asis
* @param {string} sprite Logo image path
**/
var Element = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

/** 
* Update the enemy's position, required method for game
**/
Element.prototype.update = function() {
    return;
};

/** 
* Draw the enemy on the screen, required method for game
**/
Element.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/** 
* Return the location of the element
* @return {Array} x1, x2, y1, y2
**/
Element.prototype.getRectangle = function() {
    return [this.x, this.x + 101, this.y, this.y + 83];  
}

/** 
* Enemies our player must avoid
* @constructor 
* @param {number} x Initial location x-asis
* @param {number} y Initial location y-asis
* @param {number} v speed of the enemy
**/
var Enemy = function(x, y, v) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Element.call(this, x, y, "images/enemy-bug.png");
    this.v = v; 
}; 

Enemy.prototype = Object.create(Element.prototype);

/** 
* Update the enemy's position, required method for game
* @param {number} dt a time delta between ticks
**/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x =  this.x + dt * this.v;

    // end of canvas
    if (this.x > 505) {
        goog.array.remove(allEnemies, this);
    }
}

/** 
* Now write your own player class
* This class requires an update(), render() and
* a handleInput() method.
* @constructor 
*/
var Player = function(){
    Element.call(this, 200, 400, "images/char-boy.png");
};

Player.prototype = Object.create(Element.prototype);

/**
 * Check if it hits the enemies
 */
Player.prototype.update = function() {
    var isHit = false;
    var player_rect = player.getRectangle();
    var player_loc = [(player_rect[0] + player_rect[1]) / 2, (player_rect[2] + player_rect[3]) / 2];

    allEnemies.forEach(function(en) {
        var enemy_loc = en.getRectangle();
        if (enemy_loc[0] < player_loc[0] && player_loc[0] < enemy_loc[1]
            && enemy_loc[2] < player_loc[1] && player_loc[1] < enemy_loc[3]) {
            console.log(enemy_loc);
            isHit = true;
        }
    });

    if (isHit) {
        this.x = 200;
        this.y = 400;
    };

    // if it goes out of canvas
    if (this.x > 405 || this.x < -100 || this.y > 400 || this.y < -50) {
    	this.x = 200;
    	this.y = 400;
    }

};

/** 
* Move the player based on users input
* @param {string} key input from user
**/
Player.prototype.handleInput = function(key) {
    console.log(this.x, this.y);
    if (!key)
        return;
    console.log(key);

    var move_distance = {"up": [0, -83], "down": [0, 83], "left": [-101, 0], "right": [101, 0]};
    this.x += move_distance[key][0];
    this.y += move_distance[key][1];
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var addEnemy = function() {
    var init_loc = [[0, 50], [0, 50 +83], [0, 50 + 83*2]];
    var rand_loc = init_loc[parseInt(Math.random() * 3)];
    var rand_v = parseInt(Math.random() * 300 + 100);

    var en = new Enemy(rand_loc[0], rand_loc[1], rand_v); 
    allEnemies.push(en);
    setTimeout(addEnemy, 1000);
};

addEnemy();

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
