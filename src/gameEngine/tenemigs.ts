import { AnimatedSprite, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { Coord } from "./coordinate";
import { HitBox } from "./hitBox";
import { Level } from "./level";

export const tenemigsWidth = 10;
export const tenemigsHeight = 15;

export const tenemigsSpriteTime = 25;

export class Tenemigs extends HitBox {

    #showHitBox: boolean;

    #graphics: Graphics;
    #animatedSprite: AnimatedSprite;
    
    #textures: Texture[] = [];

    #spriteTime: number = tenemigsSpriteTime;
    #spriteFrame: number = 0;
    #facingRight: boolean = true;

    constructor(coordinate: Coord, showHitBox: boolean = false) {
        super({coordinate: coordinate, width: tenemigsWidth, height: tenemigsHeight});

        this.#showHitBox = showHitBox;
        if(this.#showHitBox) {
            this.#graphics = new Graphics();
            this.#graphics.beginFill(0x0000FF);
            this.#graphics.drawRect(0, 0, this._width, this._height);
            this.#graphics.endFill();
        }

        this.#textures = [Texture.from('assets/tenemigs/idle/tenemigs-idle-00.png'),    // 0
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-01.png'),      // 1
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-02.png'),      // 2
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-03.png'),      // 3
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-04.png'),      // 4
                        Texture.from('assets/tenemigs/idle/tenemigs-idle-05.png')       // 5
                    ];

        this.#animatedSprite = new AnimatedSprite(this.#textures);
    }

    addToStage(level: Level) {
        if(this.#showHitBox) {
            this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
            this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
            level.app.stage.addChild(this.#graphics);
        }
        this.#animatedSprite.anchor.x = 0.5;
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + this._width/2;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y;
        level.app.stage.addChild(this.#animatedSprite);
    }
    
    update(level: Level, delta: number) {
        if(this.#showHitBox) {
            this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
            this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
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