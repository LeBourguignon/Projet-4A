import { AnimatedSprite, Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { Coord } from "../coordinate";
import { HitBox } from "../hitBox";
import { Level } from "../level";

export const tenemigsWidth = 10;
export const tenemigsHeight = 15;

export const tenemigsSpriteTime = 25;

export const tenemigsLightingRadius = 3*32;

export class Tenemigs extends HitBox {

    #showHitBox: boolean;

    #hitBox: Graphics;
    #animatedSprite: AnimatedSprite;
    
    #textures: Texture[] = [];

    #spriteTime: number = tenemigsSpriteTime;
    #spriteFrame: number = 0;
    #facingRight: boolean = true;

    constructor(coordinate: Coord, showHitBox: boolean = false) {
        super({coordinate: coordinate, width: tenemigsWidth, height: tenemigsHeight});

        this.#showHitBox = showHitBox;
        if(this.#showHitBox) {
            this.#hitBox = new Graphics();
            this.#hitBox.beginFill(0x0000FF)
                        .drawRect(0, 0, this._width, this._height)
                        .endFill();
        }

        this.#textures = [Texture.from('assets/tenemigs/idle/tenemigs-idle-00.png'),    // 0
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-01.png'),      // 1
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-02.png'),      // 2
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-03.png'),      // 3
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-04.png'),      // 4
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-05.png')       // 5
                    ];

        this.#textures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });

        this.#animatedSprite = new AnimatedSprite(this.#textures);
    }

    addToStage(level: Level) {
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
            level.app.stage.addChild(this.#hitBox);
        }
        this.#animatedSprite.anchor.x = 0.5;
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + this._width/2;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y;
        level.app.stage.addChild(this.#animatedSprite);
    }

    addLighting(level: Level, lighting: Graphics) {
        /*
        lighting.beginFill(0xFF0000)
                      .drawCircle(this._coordinate.x + this._width/2 + level.camCoordinate.x + level.size.coordinate.x, this._coordinate.y + this._height/2 + level.camCoordinate.y + level.size.coordinate.y, tenemigsLightingRadius)
                      .endFill();
        */
    }

    setMask(mask: Sprite) {
        if(this.#showHitBox)
            this.#hitBox.mask = mask;
        this.#animatedSprite.mask = mask;
    }
    
    update(level: Level, delta: number) {
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
        }
        
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + this._width/2;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y;
        
        this.#updateAnimation(level, delta);
    }

    #updateAnimation(level: Level, delta: number) {
        if(this.#spriteFrame > 5) {    // Neutral
            this.#spriteTime = tenemigsSpriteTime;
            this.#spriteFrame = 0;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else {
            this.#spriteTime -= delta;
            
            if(this.#spriteTime < 0) {
                this.#spriteTime = tenemigsSpriteTime;
                this.#spriteFrame = (this.#spriteFrame + 1) % 6;
                this.#animatedSprite.currentFrame = this.#spriteFrame;
            }
        }

        // Orientation
        if(level.player.coordinate.x > this._coordinate.x + this._width && !this.#facingRight) {
            this.#facingRight = true;
            this.#animatedSprite.scale.x *= -1;
        }
        if(level.player.coordinate.x + level.player.width < this._coordinate.x && this.#facingRight) {
            this.#facingRight = false;
            this.#animatedSprite.scale.x *= -1;
        }
    }
}