import { Block } from "./block.js";
import { Coordinate } from "./coordinate.js";
import { isOverlaid } from "./hitBox.js";
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

var player = new Player(new Coordinate({x: canvas.width*0.5, y: 0}));
var floor = new Block(new Coordinate({x: 0, y: canvas.height*0.9}), canvas.width, canvas.height*0.1);
var block1 = new Block(new Coordinate({x: canvas.width*0.5, y: canvas.height*0.7}), canvas.width*0.5, 10);
var block2 = new Block(new Coordinate({x: 0, y: canvas.height*0.5}), canvas.width*0.5, 10);
var block3 = new Block(new Coordinate({x: canvas.width*0.5, y: canvas.height*0.3}), canvas.width*0.5, 10);
var obstacles = [floor, block1, block2, block3];

function update() {
    player.update(canvas, obstacles, rightPressed, leftPressed, upPressed);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    obstacles.forEach(obstacle => {
        obstacle.draw(ctx);
    });
    player.draw(ctx);
}

setInterval(update, 10);