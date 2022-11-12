import { Application, ICanvas } from "pixi.js";
import { Coordinate } from "./coordinate";
import { HitBox } from "./hitBox";
import { Player } from "./player";

export type Keys = { upPressed: Boolean, downPressed: Boolean, rightPressed: boolean, leftPressed: Boolean }
export type Map = { drawables: HitBox[], obstacles: HitBox[], player: Player, camCoordinate: Coordinate }

export class Level {
    #app: Application<ICanvas>
    #keys: Keys;

    #drawables: HitBox[]
    #obstacles: HitBox[];
    #player: Player;

    #camCoordinate: Coordinate;
    #elapsed = 0.0;

    constructor(app: Application<ICanvas>, level: Map) {
        this.#app = app;
        this.#keys = { upPressed: false, downPressed: false, rightPressed: false, leftPressed: false};

        this.#drawables = level.drawables;
        this.#player = level.player;
        this.#obstacles = level.obstacles;
        this.#camCoordinate = level.camCoordinate;

        this.#drawables.forEach(drawable => {
            drawable.addToStage(this);
        });
    }

    set app(value: Application<ICanvas>) { this.#app = value; }
    get app(): Application<ICanvas> { return this.#app; }

    set keys(value: Keys) { this.#keys = value; }
    get keys(): Keys { return this.#keys; }

    set drawables(value: HitBox[]) { this.#drawables = value; }
    get drawables(): HitBox[] { return this.#drawables; }

    set player(value: Player) { this.#player = value; }
    get player(): Player { return this.#player; }
    
    set obstacles(value: HitBox[]) { this.#obstacles = value; }
    get obstacles(): HitBox[] { return this.#obstacles; }

    set camCoordinate(value: Coordinate) { this.#camCoordinate = value; }
    get camCoordinate(): Coordinate { return this.#camCoordinate; }

    update(delta: number) {
        this.#elapsed += delta;
        this.#drawables.forEach(drawable => {
            drawable.update(this, delta);
        });
    }
}