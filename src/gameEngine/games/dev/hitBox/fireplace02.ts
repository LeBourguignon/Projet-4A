import { AnimatedSprite, Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { assets } from "../../../..";
import { Coord } from "../../../patterns/coordinate";
import { HitBox } from "../../../patterns/hitBox";
import { Level } from "../../../patterns/level";

export const firePlace02Width = 48;
export const firePlace02Height = 48;

export const firePlace02SpriteTime = 10;

export const firePlace02LightingRadius = 4*64;

export class FirePlace02 extends HitBox {
    #showHitBox: boolean;

    #hitBox: Graphics;
    #animatedSprite: AnimatedSprite;
    #interactiveSprite: AnimatedSprite;
    
    #textures: Texture[] = [];

    #spriteTime: number = firePlace02SpriteTime;
    #spriteFrame: number = 0;

    #interactiveSpriteTime: number = 20;
    #interactiveSpriteFrame: number = 0;

    #state: boolean = false;

    constructor(coordinate: Coord, showHitBox: boolean = false) {
        super({coordinate: coordinate, width: firePlace02Width, height: firePlace02Height});

        this.#showHitBox = showHitBox;
        if(this.#showHitBox) {
            this.#hitBox = new Graphics();
            this.#hitBox.beginFill(0x0000FF)
                        .drawRect(0, 0, this._width, this._height)
                        .endFill();
        }

        this.#textures = [
                        assets.light.fireplace02Off,    // 0
                        assets.light.fireplace02On00,   // 1
                        assets.light.fireplace02On01,   // 2
                        assets.light.fireplace02On02,   // 3
                        assets.light.fireplace02On03,   // 4
                        assets.light.fireplace02On04,   // 5
                        assets.light.fireplace02On05    // 6
                    ];

        this.#textures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });

        this.#animatedSprite = new AnimatedSprite(this.#textures);
        this.#animatedSprite.anchor.x = 0.5;
        this.#animatedSprite.anchor.y = 0.5;

        const interactiveTextures = [
            assets.keys.keyE00, // 0
            assets.keys.keyE01  // 1
        ];

        interactiveTextures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });

        this.#interactiveSprite = new AnimatedSprite(interactiveTextures);
        this.#interactiveSprite.anchor.set(0.5, 1);
        this.#interactiveSprite.scale.set(2);
    }

    addToStage(level: Level) {
        if(this.#showHitBox) 
            level.game.app.stage.addChild(this.#hitBox);
        level.game.app.stage.addChild(this.#animatedSprite);
        level.game.app.stage.addChild(this.#interactiveSprite);

        this.#updateCoordinates(level, 0);
    }

    addLighting(level: Level, lighting: Graphics) {
        if(this.#state) {
            lighting.beginFill(0xFF0000)
                    .drawCircle(this._coordinate.x + this._width/2 - level.camCoordinate.x + level.size.coordinate.x, this._coordinate.y + this._height/2 - level.camCoordinate.y + level.size.coordinate.y, firePlace02LightingRadius)
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

        this.#updateCoordinates(level, delta);
        this.#updateAnimation(level, delta);
    }

    #updateCoordinates(level: Level, delta: number) {
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x - level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y - level.camCoordinate.y;
        }
        
        this.#animatedSprite.x = this._coordinate.x - level.camCoordinate.x + this._width/2;
        this.#animatedSprite.y = this._coordinate.y - level.camCoordinate.y + this._height/2;

        this.#interactiveSprite.x = this._coordinate.x - level.camCoordinate.x + this._width/2;
        this.#interactiveSprite.y = level.player.coordinate.y - level.camCoordinate.y - 10;
    }

    #updateAnimation(level: Level, delta: number) {
        // Animated
        if(!this.#state) {
            this.#spriteTime = 0;
            this.#spriteFrame = 0;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else {
            this.#spriteTime -= delta;
            
            if(this.#spriteTime < 0) {
                this.#spriteTime = firePlace02SpriteTime;
                this.#spriteFrame = this.#spriteFrame % 6 + 1;
                this.#animatedSprite.currentFrame = this.#spriteFrame;
            }
        }

        // Interactive
        if(this.isOverlaid(level.player)) {
            this.#interactiveSprite.visible = true;
            this.#interactiveSpriteTime -= delta;

            if(this.#interactiveSpriteTime < 0) {
                this.#interactiveSpriteTime = 20;
                this.#interactiveSpriteFrame = (this.#interactiveSpriteFrame + 1) % 2;
                this.#interactiveSprite.currentFrame = this.#interactiveSpriteFrame;
            }
        }
        else {
            this.#interactiveSprite.visible = false;
            this.#interactiveSpriteTime = 0;
            this.#interactiveSpriteFrame = 1;
        }
    }
}