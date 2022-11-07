import { Level } from "./level.js";
import { Player } from "./player.js";
import { StaticColorBlock } from "./staticColorBlock.js";

var canvas = document.getElementById("application") as HTMLCanvasElement;
var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

var player = new Player({x: canvas.width*0.5, y: 0});
var floor = new StaticColorBlock({coordinate: {x: 0, y: canvas.height*0.9}, width: canvas.width, height: canvas.height*0.1}, "#262626");
var block1 = new StaticColorBlock({coordinate: {x: canvas.width*0.6, y: canvas.height*0.7}, width: canvas.width*0.4, height: 10}, "#262626");
var block2 = new StaticColorBlock({coordinate: {x: 0, y: canvas.height*0.5}, width: canvas.width*0.4, height: 10}, "#262626");
var block3 = new StaticColorBlock({coordinate: {x: canvas.width*0.6, y: canvas.height*0.3}, width: canvas.width*0.4, height: 10}, "#262626");

var level = new Level(canvas, {upPressed: false, leftPressed: false, rightPressed: false}, {drawables: [player, floor, block1, block2, block3], updatables: [player], player: player, obstacles: [floor, block1, block2, block3]});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        level.keys.rightPressed = true;
    }
    if(e.keyCode == 37 || e.keyCode == 81) {
        level.keys.leftPressed = true;
    }
    if(e.keyCode == 38 || e.keyCode == 90) {
        level.keys.upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        level.keys.rightPressed = false;
    }
    if(e.keyCode == 37 || e.keyCode == 81) {
        level.keys.leftPressed = false;
    }
    if(e.keyCode == 38 || e.keyCode == 90) {
        level.keys.upPressed = false;
    }
}

function update() {
    level.update();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    level.draw();
}

setInterval(update, 10);