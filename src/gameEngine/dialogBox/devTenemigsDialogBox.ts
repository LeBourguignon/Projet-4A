import { SCALE_MODES, Sprite, Texture } from "pixi.js";
import { DialogBox } from "../patterns/dialogBox";
import { Level } from "../patterns/level";

export class DevTenemigsDialogBox extends DialogBox {
    #background: Sprite;

    constructor(texts: string[]) {
        super({coordinate: {x: 0, y: 0}, width: 16*32, height: 2*32}, texts);

        const texture = Texture.from('assets/noManifest/dialogBox/background.png');
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        this.#background = new Sprite(texture);
        this.#background.x = this._coordinate.x;
        this.#background.y = this._coordinate.y;
    }

    start(level: Level) {
        if(this._texts.length) {
            level.game.app.stage.addChild(this.#background);
            this._isStarted = true;
        }
        else
            throw "Give text for the dialog box!"
    }

    update(level: Level, delta: number) {
        
    }

    #end(level: Level) {
        this.#background.removeFromParent();
        this._isStarted = false;
    }
}