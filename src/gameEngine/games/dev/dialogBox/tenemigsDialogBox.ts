import { Sound } from "@pixi/sound";
import { AnimatedSprite, SCALE_MODES, Sprite, Text, Texture } from "pixi.js";
import { assets } from "../../../..";
import { DialogBox } from "../../../patterns/dialogBox";
import { Level } from "../../../patterns/level";


export class TenemigsDialogBox extends DialogBox {
    #background: Sprite;
    #interactiveSprite: AnimatedSprite;
    #displayText: Text;

    #interactiveSpriteTime: number = 20;
    #interactiveSpriteFrame: number = 0;

    #displayTextTime: number = 5;
    #displayTextLetter: number = 0;

    #voice: Sound | null = null;

    constructor(texts: string[]) {
        super({coordinate: {x: 0, y: 0}, width: 16*64, height: 3*64}, texts);

        this.#background = new Sprite(assets.tenemigs.tenemigsDialogboxBackground);
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
        this.#interactiveSprite.scale.set(2.5);
        this.#interactiveSprite.anchor.set(2, 0.7);
        this.#interactiveSprite.x = this._coordinate.x + this._width - 16;
        this.#interactiveSprite.y = this._coordinate.y + this._height - 16;

        this.#displayText = new Text('');
        // this.#displayText.width = this._width - 64;
        // this.#displayText.height = this._height - 64;
        this.#displayText.style.fontSize = 40;
        this.#displayText.x = 32;
        this.#displayText.y = 32;

        this.#voice = assets.tenemigs.tenemigsSoundVoice;
        console.log(assets.adventurer);
    }

    _addToStage(level: Level) {
        level.game.app.stage.addChild(this.#background);
        level.game.app.stage.addChild(this.#interactiveSprite);
        level.game.app.stage.addChild(this.#displayText);

        this.#displayText.text = '';
        this.#displayTextTime = 5;
        this.#displayTextLetter = 0;
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

        if(this.#displayText.text != this._texts[this._stape]) {
            this.#displayTextTime -= delta;

            if(this.#displayTextTime < 0) {
                this.#displayTextTime = 5;
                this.#displayTextLetter++;
                this.#displayText.text = this._texts[this._stape].substring(0, this.#displayTextLetter);
                if(this._texts[this._stape].charCodeAt(this.#displayTextLetter) > 32) this.#voice.play();
            }
        }
    }

    #updateInteraction(level: Level, delta: number) {
        if(this._firstUpdate) this._firstUpdate = false;
        else {
            if(level.game.keys.interaction.pressed && level.game.keys.interaction.clicked) {
                if(this.#displayText.text != this._texts[this._stape]) {
                    this.#displayTextTime = 0;
                    this.#displayTextLetter = this._texts[this._stape].length - 1;
                }
                else {
                    if(this._stape < this._texts.length - 1) {
                        this._stape++;
                        this.#displayText.text = '';
                        this.#displayTextTime = 5;
                        this.#displayTextLetter = 0;
                    }
                    else
                        this.end(level);
                }                
            }  
        }
    }

    _removeToStage(level: Level) {
        level.game.app.stage.removeChild(this.#background);
        level.game.app.stage.removeChild(this.#interactiveSprite);
        level.game.app.stage.removeChild(this.#displayText);
    }
}