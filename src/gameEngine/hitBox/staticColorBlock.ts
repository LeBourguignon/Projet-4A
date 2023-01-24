import { Graphics, Sprite } from "pixi.js";
import { Rect } from "../patterns/coordinate";
import { HitBox } from "../patterns/hitBox";
import { Level } from "../patterns/level";

export class StaticColorBlock extends HitBox {
    #color: number;
    #graphics: Graphics

    constructor(hitBox: Rect, color: number) {
        super(hitBox);
        this.#color = color;

        this.#graphics = new Graphics();
        this.#graphics.beginFill(this.#color);
        this.#graphics.drawRect(0, 0, this._width, this._height);
        this.#graphics.endFill();
        this.#graphics.x = this._coordinate.x;
        this.#graphics.y = this._coordinate.y;
    }

    addToStage(level: Level) {
        this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
        this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
        level.game.app.stage.addChild(this.#graphics);
    }

    setMask(mask: Sprite) {
        this.#graphics.mask = mask;
    }

    update(level: Level, delta: number) {
        this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
        this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
    }
}