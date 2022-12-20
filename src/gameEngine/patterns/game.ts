import { Application, ICanvas } from "pixi.js";
import { Level } from "./level";

export const windowSize = { width: 16*32, height: 9*32};

export type Keys = { 
    upPressed: boolean, 
    downPressed: boolean, 
    rightPressed: boolean, 
    leftPressed: boolean,
    interactionPressed: boolean
};

export class Game {
    _app: Application<ICanvas>;
    _keys: Keys;
    
    _levels: Level[];
    _currentLevel: Level = null;

    _elapsed = 0.0;

    constructor(element: HTMLElement, levels: Level[]) {
        //Initialisation Pixi
        this._app = new Application({ width: windowSize.width, height: windowSize.height, resolution: 2});
        element.appendChild(this._app.view as any);

        //Initialisation des niveaux
        this._levels = levels;

        //Initialisation des controlleurs
        this._keys = { upPressed: false, downPressed: false, rightPressed: false, leftPressed: false, interactionPressed: false};
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === "ArrowUp" || e.key === 'z') {
                this.keys.upPressed = true;
            }
            if(e.key === "ArrowDown" || e.key === 's') {
                this._keys.downPressed = true;
            }
            if(e.key === "ArrowLeft" || e.key === 'q') {
                this._keys.leftPressed = true;
            }
            if(e.key === "ArrowRight" || e.key === 'd') {
                this._keys.rightPressed = true;
            }
            if(e.key === "Control" || e.key === "e") {
                this._keys.interactionPressed = true;
            }
        }, false);
        

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            if(e.key === "ArrowUp" || e.key === 'z') {
                this._keys.upPressed = false;
            }
            if(e.key === "ArrowDown" || e.key === 's') {
                this._keys.downPressed = false;
            }
            if(e.key === "ArrowLeft" || e.key === 'q') {
                this._keys.leftPressed = false;
            }
            if(e.key === "ArrowRight" || e.key === 'd') {
                this._keys.rightPressed = false;
            }
            if(e.key === "Control" || e.key === "e") {
                this._keys.interactionPressed = false;
            }
        }, false);

        //Boucle Pixi
        this._app.ticker.add((delta: number) => {
            this._elapsed += delta;
            if(this._currentLevel !== null)
                this._update(delta);
        });
    }

    get app(): Application<ICanvas> { return this._app; }

    set keys(value: Keys) { this._keys = value; }
    get keys(): Keys { return this._keys; }

    _update(delta: number) {
        throw "Redefine the update method!"
    }

    _clearStage() {
        while(this._app.stage.children[0]) {
            this._app.stage.removeChild(this._app.stage.children[0])
        }
    }
}