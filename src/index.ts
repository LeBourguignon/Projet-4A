import { Application } from 'pixi.js';
import { Coordinate } from './gameEngine/coordinate';
import { Level } from './gameEngine/level';
import { Player } from './gameEngine/player';
import { StaticColorBlock } from './gameEngine/staticColorBlock';

const windowSize = { width: 1920, height: 1080};

//Initialisation Pixi
let app = new Application({ width: windowSize.width, height: windowSize.height, resolution: 2/3, backgroundAlpha: 0 });
document.body.appendChild(app.view as any);

//Initialisation gameEngine
var player = new Player({x: windowSize.width*0.5, y: windowSize.height*0.3});
var floor = new StaticColorBlock({coordinate: {x: 0, y: windowSize.height*0.9}, width: windowSize.width, height: windowSize.height*0.1}, 0x262626);
var block1 = new StaticColorBlock({coordinate: {x: windowSize.width*0.6, y: windowSize.height*0.7}, width: windowSize.width*0.4, height: 15}, 0x262626);
var block2 = new StaticColorBlock({coordinate: {x: 0, y: windowSize.height*0.5}, width: windowSize.width*0.4, height: 15}, 0x262626);
var block3 = new StaticColorBlock({coordinate: {x: windowSize.width*0.6, y: windowSize.height*0.3}, width: windowSize.width*0.4, height: 15}, 0x262626);

var level = new Level(app, {drawables: [floor, block1, block2, block3, player], player: player, obstacles: [floor, block1, block2, block3], camCoordinate: new Coordinate({x: 0, y: 0})});

//Initialisation controlleur
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e: KeyboardEvent) {
    if(e.key === "ArrowUp" || e.key === 'z') {
        level.keys.upPressed = true;
    }
    if(e.key === "ArrowDown" || e.key === 's') {
        level.keys.downPressed = true;
    }
    if(e.key === "ArrowLeft" || e.key === 'q') {
        level.keys.leftPressed = true;
    }
    if(e.key === "ArrowRight" || e.key === 'd') {
        level.keys.rightPressed = true;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if(e.key === "ArrowUp" || e.key === 'z') {
        level.keys.upPressed = false;
    }
    if(e.key === "ArrowDown" || e.key === 's') {
        level.keys.downPressed = false;
    }
    if(e.key === "ArrowLeft" || e.key === 'q') {
        level.keys.leftPressed = false;
    }
    if(e.key === "ArrowRight" || e.key === 'd') {
        level.keys.rightPressed = false;
    }
}

//Boucle Pixi
app.ticker.add((delta: number) => {
  level.update(delta);
});