import { Application, ICanvas } from "pixi.js";
import { Level } from "./level";

export type WindowSize = { 
    width: number, 
    height: number, 
    resolution: number
};

export type Key = {
    pressed: boolean,
    clicked: boolean
};

export type Keys = { 
    up: Key,  
    right: Key, 
    left: Key,
    interaction: Key,
    hit: Key
};

export class Game {
    _app: Application<ICanvas>;
    _keys: Keys;
    
    _levels: Level[];
    _currentLevel: Level = null;

    _elapsed = 0.0;

    constructor(element: HTMLElement, windowSize: WindowSize, levels: Level[]) {
        //Initialisation Pixi
        this._app = new Application({ width: windowSize.width, height: windowSize.height, resolution: windowSize.resolution});
        element.appendChild(this._app.view as any);

        //Initialisation des niveaux
        this._levels = levels;

        //Initialisation des controlleurs
        this._keys = { up: {pressed: false, clicked: false}, right: {pressed: false, clicked: false}, left: {pressed: false, clicked: false}, interaction: {pressed: false, clicked: false}, hit: {pressed: false, clicked: false}};
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key === 'z') {
                this.keys.up.pressed = true;
            }
            if(e.key === 'q') {
                this._keys.left.pressed = true;
            }
            if(e.key === 'd') {
                this._keys.right.pressed = true;
            }
            if(e.key === 'e') {
                this._keys.interaction.pressed = true;
            }
            if(e.key === ' ') {
                this._keys.hit.pressed = true;
            }
        }, false);
        

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            if(e.key === 'z') {
                this._keys.up.pressed = false;
            }
            if(e.key === 'q') {
                this._keys.left.pressed = false;
            }
            if(e.key === 'd') {
                this._keys.right.pressed = false;
            }
            if(e.key === "e") {
                this._keys.interaction.pressed = false;
            }
            if(e.key === ' ') {
                this._keys.hit.pressed = false;
            }
        }, false);

        //Boucle Pixi
        this._app.ticker.add((delta: number) => {
            this._elapsed += delta;
            if(this._currentLevel !== null)
                this._update(delta);
            this._updateKeysClicked();
        });
    }

    get app(): Application<ICanvas> { return this._app; }

    set keys(value: Keys) { this._keys = value; }
    get keys(): Keys { return this._keys; }

    _update(delta: number) {
        throw "Redefine the update method!"
    }

    _updateKeysClicked() {
        this._keys.up.clicked = !this._keys.up.pressed;
        this._keys.left.clicked = !this._keys.left.pressed;
        this._keys.right.clicked = !this._keys.right.pressed;
        this._keys.interaction.clicked = !this._keys.interaction.pressed;
        this._keys.hit.clicked = !this._keys.hit.pressed;
    }
}