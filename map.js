'use strict';

let ctx = null,
    tileW = 40, tileH = 40,
    mapW = 25, mapH = 25,
    
    currentSecond = 0, frameCount = 0, framesLastSecond = 0,
    lastFrameTime = 0;

let keysDown = {
    37: false,
    38: false,
    39: false,
    40: false
};

let  floorTypes ={
  solid   : 0,
  path    : 1,
  water   : 2
};

let water = new Image(),
    path = new Image(),
    grass = new Image(),
    wall = new Image(),
    tree = new Image(),
    snow = new Image(),
    ice = new Image(),
    sand = new Image(),
    bush = new Image();

water.src = 'sprites/water.jpg';
path.src = 'sprites/path.jpg';
grass.src = 'sprites/grass.jpg';
wall.src = 'sprites/wall.jpg';
tree.src = 'sprites/tree.jpg';
snow.src = 'sprites/snow.jpg';
ice.src = 'sprites/ice.jpg';
sand.src = 'sprites/sand.jpg';
bush.src = 'sprites/bush.jpg';

let tileTypes = {
  0: {floor:floorTypes.solid, sprite: wall}, //стена
  1: {floor:floorTypes.path, sprite: grass}, //трава
  2: {floor:floorTypes.path, sprite: path}, //дорога
  3: {floor:floorTypes.solid, sprite: tree}, //деревья
  4: {floor:floorTypes.water, sprite: water}, //вода
  5: {floor:floorTypes.path, sprite: bush}, //кусты
  6: {floor:floorTypes.path, sprite: snow}, //снег
  7: {floor:floorTypes.path, sprite: sand}, //песок
  8: {floor:floorTypes.path, sprite: ice} //лед
};

let player = new Character();

let gameMap0 =[
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 2, 1, 1, 1, 1, 1, 6, 8, 8, 8, 8, 2, 0,
    0, 2, 7, 4, 4, 4, 4, 4, 4, 7, 1, 1, 2, 1, 1, 1, 1, 1, 6, 6, 8, 8, 8, 2, 0,
    0, 2, 7, 4, 4, 4, 4, 4, 4, 7, 1, 1, 2, 1, 0, 0, 1, 1, 1, 6, 6, 8, 8, 2, 0,
    0, 2, 7, 4, 4, 4, 4, 4, 4, 7, 1, 1, 2, 2, 0, 0, 1, 1, 1, 1, 6, 6, 8, 2, 0,
    0, 2, 7, 4, 4, 4, 4, 4, 7, 7, 1, 1, 2, 1, 0, 0, 1, 1, 1, 1, 1, 6, 6, 2, 0,
    0, 2, 7, 4, 4, 4, 4, 7, 7, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0,
    0, 2, 7, 7, 4, 4, 7, 7, 1, 0, 0, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 2, 0,
    0, 2, 7, 7, 7, 4, 7, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 2, 0,
    0, 2, 1, 1, 1, 4, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 0,
    0, 2, 1, 1, 1, 4, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 5, 5, 2, 2, 5, 5, 1, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 1, 1, 1, 4, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0,
    0, 2, 1, 1, 1, 4, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0,
    0, 2, 1, 5, 1, 4, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0,
    0, 2, 1, 5, 1, 4, 1, 1, 3, 3, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0,
    0, 2, 1, 5, 1, 4, 1, 1, 3, 3, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0,
    0, 2, 1, 5, 1, 4, 4, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 2, 2, 0, 0, 1, 2, 0,
    0, 2, 1, 5, 1, 1, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 2, 0,
    0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0,
    0, 2, 1, 3, 1, 1, 1, 1, 1, 3, 1, 5, 2, 5, 1, 1, 1, 3, 2, 2, 3, 1, 1, 2, 0,
    0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 5, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

let viewport = {
  screen    :[0, 0],
  startTile :[0, 0],
  endTile   :[0, 0],
  offset    :[0, 0],
    
  update    :function(px, py) {
    this.offset[0] = Math.floor((this.screen[0] / 2) - px);
    this.offset[1] = Math.floor((this.screen[1] / 2) - py);
      
    var tile = [
      Math.floor(px / tileW),
      Math.floor(py / tileH)
    ];
      
    this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0] / 2) / tileW);
    this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1] / 2) / tileH);
      
    if(this.startTile[0] < 0){
      this.startTile[0] = 0;
    }
      if(this.startTile[1] < 0){
      this.startTile[1] = 0;
    }
      
    this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0] / 2) / tileW);
    this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1] / 2) / tileH);
      
    if(this.endTile[0] >= mapW) {
      this.endTile[0] = mapW - 1;
    }
    if(this.endTile[1] >= mapH) {
      this.endTile[1] = mapH - 1;
    }
  }
};


function Character() {
  this.tileFrom = [1, 1];
  this.tileTo = [1, 1];
  this.timeMoved = 0;
  this.dimensions = [30, 30];
  this.position = [45, 45];
  this.delayMove = 100;
}

Character.prototype.placeAt = function(x, y){
  this.tileFrom = [x, y];
  this.tileTo = [x, y];
  this.position = [((tileW*x) + ((tileW - this.dimensions[0]) / 2)),
                   ((tileH*y) + ((tileH - this.dimensions[1]) / 2))];
};

Character.prototype.processMovement = function(t) {
    if(this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) {
      return false;
    }
    
    if((t - this.timeMoved) >= this.delayMove) {
      this.placeAt(this.tileTo[0], this.tileTo[1]);
    }
    
    else {
      this.position[0] = (this.tileFrom[0]*tileW) + ((tileW - this.dimensions[0])/2);
      this.position[1] = (this.tileFrom[1]*tileH) + ((tileH - this.dimensions[1])/2);
        
      if(this.tileTo[0] != this.tileFrom[0]) {
        let diff = (tileW / this.delayMove)*(t - this.timeMoved);
        this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
      }
        
      if(this.tileTo[1] != this.tileFrom[1]) {
        let diff = (tileH / this.delayMove)*(t - this.timeMoved);
        this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
      }
        
      this.position[0] = Math.round(this.position[0]);
      this.position[1] = Math.round(this.position[1]);
    }
    return true;
};


Character.prototype.canMoveTo = function(x, y) {
  if(x < 0 || x >= mapW || y < 0 || y >= mapH) {
      return false;
  }
  if(tileTypes[gameMap0[toIndex(x, y)]].floor != floorTypes.path) {
      return false;
  } 
  return true;
};


Character.prototype.canMoveLeft = function() {
  return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
};
Character.prototype.canMoveRight = function() {
  return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
};
Character.prototype.canMoveDown = function() {
  return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
};
Character.prototype.canMoveUp = function() {
  return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
};


Character.prototype.MoveLeft = function(t){
  this.tileTo[0]--;
  this.timeMoved = t;
};
Character.prototype.MoveRight = function(t){
  this.tileTo[0]++;
  this.timeMoved = t;
};
Character.prototype.MoveDown = function(t){
  this.tileTo[1]++;
  this.timeMoved = t;
};
Character.prototype.MoveUp = function(t){
  this.tileTo[1]--;
  this.timeMoved = t;
};


function toIndex(x, y) {
  return ((y * mapW) + x);
}

window.onload = function() {
    
    ctx = document.getElementById('game').getContext('2d');
    requestAnimationFrame(drawGame);
    
    window.addEventListener("keydown", function(e) {
      if(e.keyCode >= 37 && e.keyCode <= 40) {
        keysDown[e.keyCode] = true;
      }
    });
    
    window.addEventListener("keyup", function(e) {
      if(e.keyCode >= 37 && e.keyCode <= 40){
        keysDown[e.keyCode] = false;
      }
    });
    
    viewport.screen =[
      document.getElementById('game').width,
      document.getElementById('game').height
    ];
};


function drawGame() {
    
    if(ctx == null) return;
    
    let currentFrameTime = Date.now(),
        timeElapsed = currentFrameTime - lastFrameTime;
    
    let sec = Math.floor(Date.now() / 1000);
    
    if(sec != currentSecond) {
      currentSecond = sec;
      framesLastSecond = frameCount;
      frameCount = 1;
    }
    else frameCount++;
    
    if(!player.processMovement(currentFrameTime)) {
      if(keysDown[38] && player.canMoveUp()){
        player.MoveUp(currentFrameTime);
      }
      else if(keysDown[40] && player.canMoveDown()){
        player.MoveDown(currentFrameTime);
      }
      else if(keysDown[39] && player.canMoveRight()){
        player.MoveRight(currentFrameTime);
      }
      else if(keysDown[37] && player.canMoveLeft()){
        player.MoveLeft(currentFrameTime);
      }
    }

    viewport.update(
      player.position[0] + (player.dimensions[0] / 2),
      player.position[1] + (player.dimensions[1] / 2),
    );

    ctx.fillStyle ="#071408"
    ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

    for(let y = viewport.startTile[1]; y <= viewport.endTile[1]; y++) {
      for(let x = viewport.startTile[0]; x <= viewport.endTile[0]; x++) {
          
        ctx.drawImage(tileTypes[gameMap0[toIndex(x, y)]].sprite,
                     viewport.offset[0] + x*tileW, viewport.offset[1] + y*tileH,
                      tileW, tileH);
      }
    }
    
    ctx.fillStyle = "#0000ff";
    
    ctx.fillRect(viewport.offset[0] + player.position[0],
                 viewport.offset[1] + player.position[1],
                 player.dimensions[0], player.dimensions[1]);
    
    lastFrameTime = currentFrameTime;
    requestAnimationFrame(drawGame);
}