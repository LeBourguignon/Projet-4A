import { Graphics, Sprite } from "pixi.js";
import { Rect } from "../../../patterns/coordinate";
import { HitBox } from "../../../patterns/hitBox";
import { Level } from "../../../patterns/level";

export class Block extends HitBox {
    #dark: boolean;
    #graphics: Graphics

    constructor(hitBox: Rect, dark: boolean = false) {
        super(hitBox);
        this.#dark = dark;

        this.#graphics = new Graphics();
        if (this.#dark)
            this.#graphics.beginFill(0xD9D9D9);
        else
            this.#graphics.beginFill(0x262626);
        this.#graphics.drawRect(0, 0, this._width, this._height);
        this.#graphics.endFill();

        for (let i = 0; i < this._width/16+1; i++) {
            this.#graphics.beginFill(0x8080FF);
            this.#graphics.drawRect(i*16, 0, 1, this._height);
            this.#graphics.endFill();
        }

        for (let i = 0; i < this._height/16+1; i++) {
            this.#graphics.beginFill(0x8080FF);
            this.#graphics.drawRect(0, i*16, this._width, 1);
            this.#graphics.endFill();
        }
    }

    addToStage(level: Level) {
        this.update(level, 0);
        level.game.app.stage.addChild(this.#graphics);
    }

    setMask(mask: Sprite) {
        this.#graphics.mask = mask;
    }

    update(level: Level, delta: number) {
        this.#graphics.x = this._coordinate.x - level.camCoordinate.x;
        this.#graphics.y = this._coordinate.y - level.camCoordinate.y;
    }
}