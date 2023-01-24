import { AnimatedSprite, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { assets } from "../..";
import { DialogBox } from "../patterns/dialogBox";
import { Level } from "../patterns/level";

export class DevTenemigsDialogBox extends DialogBox {
    #background: Sprite;
    #interactiveSprite: AnimatedSprite;

    #interactiveSpriteTime: number = 20;
    #interactiveSpriteFrame: number = 0;

    constructor(texts: string[]) {
        super({coordinate: {x: 0, y: 0}, width: 16*32, height: 2*32}, texts);

        const texture = Texture.from('assets/noManifest/dialogBox/background.png');
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        this.#background = new Sprite(texture);
        this.#background.x = this._coordinate.x;
        this.#background.y = this._coordinate.y;

        const interactiveTextures = [
            assets.keys.keyE00, // 0
            assets.keys.keyE01  // 1
        ];

        interactiveTextures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });

        this.#interactiveSprite = new AnimatedSprite(interactiveTextures);
        this.#interactiveSprite.anchor.set(2, 0.7)
        this.#interactiveSprite.x = this._coordinate.x + this._width;
        this.#interactiveSprite.y = this._coordinate.y + this._height;
    }

    _addToStage(level: Level) {
        level.game.app.stage.addChild(this.#background);
        level.game.app.stage.addChild(this.#interactiveSprite);
    }

    update(level: Level, delta: number) {
        this.#updateAnimation(level, delta);  
        this.#updateInteraction(level, delta);
    }

    #updateAnimation(level: Level, delta: number) {
        this.#interactiveSprite.visible = true;
        this.#interactiveSpriteTime -= delta;

        if(this.#interactiveSpriteTime < 0) {
            this.#interactiveSpriteTime = 20;
            this.#interactiveSpriteFrame = (this.#interactiveSpriteFrame + 1) % 2;
            this.#interactiveSprite.currentFrame = this.#interactiveSpriteFrame;
        }
    }

    #updateInteraction(level: Level, delta: number) {
        if(this._firstUpdate) this._firstUpdate = false;
        else {
            if(level.game.keys.interaction.pressed && level.game.keys.interaction.clicked) {
                this.end(level);
            }  
        }
    }

    end(level: Level) {
        this._removeToStage(level);
        this._isStarted = false;
        level.ongoingDialog = false;
    }

    _removeToStage(level: Level) {
        level.game.app.stage.removeChild(this.#background);
        level.game.app.stage.removeChild(this.#interactiveSprite);
    }
}