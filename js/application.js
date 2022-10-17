import { Block } from "./block.js";
import { Coordinate } from "./coordinate.js";
import { Player } from "./player.js";

var canvas = document.getElementById("application");
var ctx = canvas.getContext("2d");

var rightPressed = false;
var leftPressed = false;
var upPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    }
    if(e.keyCode == 37 || e.keyCode == 81) {
        leftPressed = true;
    }
    if(e.keyCode == 38 || e.keyCode == 90) {
        upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    }
    if(e.keyCode == 37 || e.keyCode == 81) {
        leftPressed = false;
    }
    if(e.keyCode == 38 || e.keyCode == 90) {
        upPressed = false;
    }
}

/*

var x = canvas.width/2;
var y = canvas.height/2;
var size = 20;
var floorY = canvas.height*0.9;
var jumping = 0;
var falling = 0;

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
}

function drawFloor() {
    ctx.beginPath();
    ctx.rect(0, floorY, canvas.width, canvas.height*0.1);
    ctx.fillStyle = "#262626";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawFloor();

    if(rightPressed && x < canvas.width-size) {
        x += 5;
    }
    if(leftPressed && x > 0) {
        x -= 5;
    }
    if(upPressed && y == floorY-size) {
        jumping = 20;
    }

    if(upPressed && jumping > 0 && y >= 5) {
        jumping--;
        y-=jumping;
    }
    else if(y<canvas.height*0.9-size && falling == 0) {
        jumping = 0;
        falling = 1;
    }

    if (falling > 0) {
        y+=falling;
        falling++;
        if(y>=canvas.height*0.9-size) {
            y=canvas.height*0.9-size;
            falling = 0;
        }
    }
}

setInterval(draw, 10);
*/

var player = new Player(new Coordinate({x: canvas.width*0.5, y: canvas.height*0.2}));
var floor = new Block(new Coordinate({x: 0, y: canvas.height*0.9}), canvas.width, canvas.height*0.1);
var block = new Block(new Coordinate({x: canvas.width*0.5, y: canvas.height*0.8}), canvas.width*0.5, 10);
var obstacles = [floor, block];

function update() {
    player.update(canvas, obstacles, rightPressed, leftPressed, upPressed);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    floor.draw(ctx);
    block.draw(ctx);
}

setInterval(update, 10);