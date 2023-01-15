import { Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { Coord } from "../../patterns/coordinate";
import { HitBox } from "../../patterns/hitBox";
import { Level } from "../../patterns/level";

export class BackgroundTest extends HitBox {
    #sprite: Sprite;

    constructor(coordinate: Coord) {
        super({coordinate: coordinate, width: 0, height: 0});

        const texture = Texture.from('assets/level-0/background-test.png');
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        this.#sprite = new Sprite(texture);
        this.#sprite.scale.set(2);
        
        this.#sprite.x = this._coordinate.x;
        this.#sprite.y = this._coordinate.y;
    }

    addToStage(level: Level) {
        this.#sprite.x = this._coordinate.x + level.camCoordinate.x;
        this.#sprite.y = this._coordinate.y + level.camCoordinate.y;
        level.game.app.stage.addChild(this.#sprite);
    }

    addLighting(level: Level, lighting: Graphics) {
        
    }

    setMask(mask: Sprite) {
        this.#sprite.mask = mask;
    }

    update(level: Level, delta: number) {
        this.#sprite.x = this._coordinate.x + level.camCoordinate.x;
        this.#sprite.y = this._coordinate.y + level.camCoordinate.y;
    }
}