import { Drawable } from "./drawable.js";
import { HitBox } from "./hitBox.js";
import { Player } from "./player.js";
import { UpdatableHitBox } from "./updatableHitBox.js";

export type Keys = { upPressed: Boolean, leftPressed: Boolean, rightPressed: boolean }
export type Map = { drawables: Drawable[], updatables: UpdatableHitBox[], player: Player, obstacles: HitBox[] }

export class Level {
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D | null;
    #keys: Keys;

    #drawables: Drawable[];
    #updatables: UpdatableHitBox[];

    #player: Player;
    #obstacles: HitBox[];

    constructor(canvas: HTMLCanvasElement, keys: Keys, level: Map) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");

        this.#keys = keys;

        this.#drawables = level.drawables;
        this.#updatables = level.updatables;
        /*
        level.drawables.forEach(drawable => {
            this.#drawables.push(drawable);
        });
        level.updatables.forEach(updatable => {
            this.#updatables.push(updatable);
        });
        level.obstacles.forEach(obstacle => {
            this.#obstacles.push(obstacle);
        });
        */

        this.#player = level.player;
        this.#obstacles = level.obstacles;
    }

    set canvas(value: HTMLCanvasElement) { this.#canvas = value; }
    get canvas(): HTMLCanvasElement { return this.#canvas; }

    set ctx(value: CanvasRenderingContext2D | null) { this.#ctx = value; }
    get ctx(): CanvasRenderingContext2D | null { return this.#ctx; }

    set keys(value: Keys) { this.#keys = value; }
    get keys(): Keys { return this.#keys; }

    set drawables(value: Drawable[]) { this.#drawables = value; }
    get drawables(): Drawable[] { return this.#drawables; }
    
    set updatables(value: UpdatableHitBox[]) { this.#updatables = value; }
    get updatables(): UpdatableHitBox[] { return this.#updatables; }

    set player(value: Player) { this.#player = value; }
    get player(): Player { return this.#player; }
    
    set obstacles(value: HitBox[]) { this.#obstacles = value; }
    get obstacles(): HitBox[] { return this.#obstacles; }

    draw() {
        this.#drawables.forEach(drawable => {
            drawable.draw(this.#ctx);
        });
    }

    update() {
        this.#updatables.forEach(updatable => {
            updatable.update(this);
        });
    }
}