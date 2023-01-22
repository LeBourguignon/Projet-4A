import { AnimatedSprite, Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { assets } from "../..";
import { Coord } from "../patterns/coordinate";
import { HitBox } from "../patterns/hitBox";
import { Level } from "../patterns/level";

export const torchWidth = 24;
export const torchHeight = 30;

export const torchSpriteTime = 25;

export const torchLightingRadius = 3*32;

export class Torch extends HitBox {
    #showHitBox: boolean;

    #hitBox: Graphics;
    #animatedSprite: AnimatedSprite;
    
    #textures: Texture[] = [];

    #spriteTime: number = torchSpriteTime;
    #spriteFrame: number = 0;

    #state: boolean = false;

    constructor(coordinate: Coord, showHitBox: boolean = false) {
        super({coordinate: coordinate, width: torchWidth, height: torchHeight});

        this.#showHitBox = showHitBox;
        if(this.#showHitBox) {
            this.#hitBox = new Graphics();
            this.#hitBox.beginFill(0x0000FF)
                        .drawRect(0, 0, this._width, this._height)
                        .endFill();
        }

        this.#textures = [
                        assets.torch.torchOff,  // 0
                        assets.torch.torchOn00, // 1
                        assets.torch.torchOn01, // 2
                        assets.torch.torchOn02 // 3
                    ];

        this.#textures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });

        this.#animatedSprite = new AnimatedSprite(this.#textures);
        this.#animatedSprite.anchor.x = 0.5;
        this.#animatedSprite.anchor.y = 0.5;
        this.#animatedSprite.scale.set(0.5);
    }

    addToStage(level: Level) {
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
            level.game.app.stage.addChild(this.#hitBox);
        }
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y;
        level.game.app.stage.addChild(this.#animatedSprite);
    }

    addLighting(level: Level, lighting: Graphics) {
        if(this.#state) {
            lighting.beginFill(0xFF0000)
                    .drawCircle(this._coordinate.x + this._width/2 + level.camCoordinate.x + level.size.coordinate.x, this._coordinate.y + this._height/2 + level.camCoordinate.y + level.size.coordinate.y, torchLightingRadius)
                    .endFill();
        }
    }

    setMask(mask: Sprite) {
        if(this.#showHitBox)
            this.#hitBox.mask = mask;
        this.#animatedSprite.mask = mask;
    }

    update(level: Level, delta: number) {
        if(this.isOverlaid(level.player) && level.game.keys.interaction.pressed && level.game.keys.interaction.clicked)
            this.#state = !this.#state;

        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
        }
        
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + this._width/2;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y + this._height - this.#animatedSprite.height/2;
        
        this.#updateAnimation(level, delta);
    }

    #updateAnimation(level: Level, delta: number) {
        if(!this.#state) {    // Neutral
            this.#spriteTime = 0;
            this.#spriteFrame = 0;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else {
            this.#spriteTime -= delta;
            
            if(this.#spriteTime < 0) {
                this.#spriteTime = torchSpriteTime;
                this.#spriteFrame = (this.#spriteFrame + 1) % 3 + 1;
                this.#animatedSprite.currentFrame = this.#spriteFrame;
            }
        }
    }
}