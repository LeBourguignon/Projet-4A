import { Application } from 'pixi.js';
import { DevLevel } from './gameEngine/levels/devLevel';
import { DevLevelInTheDarkness } from './gameEngine/levels/devLevelInTheDarkness';

const windowSize = { width: 16*32, height: 9*32};
//const windowSize = { width: 1920, height: 1080};

//Initialisation Pixi
let app = new Application({ width: windowSize.width, height: windowSize.height, resolution: 2});
document.body.appendChild(app.view as any);

//Initialisation gameEngine
var level = new DevLevel(app);
//var level = new DevLevelInTheDarkness(app);

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