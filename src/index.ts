/*
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

function keyDownHandler(e: KeyboardEvent) {
    if(e.key === "ArrowRight" || e.key === 'd') {
        level.keys.rightPressed = true;
    }
    if(e.key === "ArrowLeft" || e.key === 'q') {
        level.keys.leftPressed = true;
    }
    if(e.key === "ArrowUp" || e.key === 'z') {
        level.keys.upPressed = true;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if(e.key === "ArrowRight" || e.key === 'd') {
        level.keys.rightPressed = false;
    }
    if(e.key === "ArrowLeft" || e.key === 'q') {
        level.keys.leftPressed = false;
    }
    if(e.key === "ArrowUp" || e.key === 'z') {
        level.keys.upPressed = false;
    }
}

function update() {
    level.update();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    level.draw();
}

setInterval(update, 10);
*/


import { Application, Sprite } from 'pixi.js';

// Create the application helper and add its render target to the page
let app = new Application({ width: 720, height: 480 });
document.body.appendChild(app.view as any);

// Create the sprite and add it to the stage
let sprite = Sprite.from('a.jpg');
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta: number) => {
  elapsed += delta;
  sprite.y = 100.0 + Math.cos(elapsed/50.0) * 100.0;
});