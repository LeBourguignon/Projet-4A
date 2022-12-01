import { AnimatedSprite, Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { Coord, Coordinate } from "../coordinate";
import { HitBox } from "../hitBox";
import { Level } from "../level";

export const playerWidth = 16;
export const playerHeight = 30;

export const playerSpeed = 4;
export const playerJumpBoost = 9;
export const playerWeight = 0.7;

export const playerSpriteTime = 25;

export const playerLightingRadius = 3*32;

export class Player extends HitBox {
    #speed: number = playerSpeed;
    #jumpBoost: number = playerJumpBoost;
    #weight: number = playerWeight;

    #vx: number = 0;
    #vy: number = 0;
    #secondJump: boolean = false;
    #upClicked: boolean = false;

    #showHitBox: boolean;

    #hitBox: Graphics;
    #animatedSprite: AnimatedSprite;
    
    #textures: Texture[];

    #spriteTime: number = playerSpriteTime;
    #spriteFrame: number = 0;
    #facingRight: boolean = true;

    constructor(coordinate: Coord, showHitBox: boolean = false) {
        super({coordinate: coordinate, width: playerWidth, height: playerHeight});

        this.#showHitBox = showHitBox;
        if(this.#showHitBox) {
            this.#hitBox = new Graphics();
            this.#hitBox.beginFill(0x0000FF)
                        .drawRect(0, 0, this._width, this._height)
                        .endFill();
        }

        this.#textures = [Texture.from('assets/player/idle/adventurer-idle-00.png'),    // 0
                    Texture.from('assets/player/idle/adventurer-idle-01.png'),          // 1
                    Texture.from('assets/player/idle/adventurer-idle-02.png'),          // 2
                    Texture.from('assets/player/idle/adventurer-idle-03.png'),          // 3

                    Texture.from('assets/player/run/adventurer-run-00.png'),            // 4
                    Texture.from('assets/player/run/adventurer-run-01.png'),            // 5
                    Texture.from('assets/player/run/adventurer-run-02.png'),            // 6
                    Texture.from('assets/player/run/adventurer-run-03.png'),            // 7
                    Texture.from('assets/player/run/adventurer-run-04.png'),            // 8
                    Texture.from('assets/player/run/adventurer-run-05.png'),            // 9
                
                    Texture.from('assets/player/jump/adventurer-jump-00.png'),          // 10
                    Texture.from('assets/player/jump/adventurer-jump-01.png'),          // 11
                    Texture.from('assets/player/jump/adventurer-jump-02.png'),          // 12
                    Texture.from('assets/player/jump/adventurer-jump-03.png'),          // 13

                    Texture.from('assets/player/fall/adventurer-fall-00.png'),          // 14
                    Texture.from('assets/player/fall/adventurer-fall-01.png'),          // 15
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
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + 8;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y - 6;
        level.app.stage.addChild(this.#animatedSprite);
    }

    addLighting(level: Level, lighting: Graphics) {
        lighting.beginFill(0xFF0000)
                .drawCircle(this._coordinate.x + this._width/2 + level.camCoordinate.x + level.size.coordinate.x, this._coordinate.y + this._height/2 + level.camCoordinate.y + level.size.coordinate.y, playerLightingRadius)
                .endFill();
    }

    setMask(mask: Sprite) {
        if(this.#showHitBox)
            this.#hitBox.mask = mask;
        this.#animatedSprite.mask = mask;
    }

    update(level: Level, delta: number) {
        this.#updateX(level, delta);
        this.#updateY(level, delta);
        
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
        }
        
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + 8;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y - 6;
        
        this.#updateAnimation(level, delta);
    }

    #updateX(level: Level, delta: number) {
        if(level.keys.leftPressed && !level.keys.rightPressed)  // left
            this.#vx = -this.#speed;
        else if(!level.keys.leftPressed && level.keys.rightPressed) // right
            this.#vx = this.#speed;
        else    // neutral
            this.#vx = 0;

        if(this.#vx != 0) {
            var nextHitBox = new HitBox(this);
            var i = 0, x0 = this._coordinate.x;
            while(i < Math.abs(this.#vx)*delta) {
                i++;
                nextHitBox.coordinate = new Coordinate({x: x0 + Math.sign(this.#vx)*i, y: nextHitBox.coordinate.y});
                if(!nextHitBox.areOverlaid(level.obstacles)) {
                    this._coordinate.x = nextHitBox.coordinate.x;
                }
                else {
                    i = Math.abs(this.#vx)*delta;
                }
            }
        }
    }

    #updateY(level: Level, delta: number) {            
        var nextHitBox = new HitBox(this);
        nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: nextHitBox.coordinate.y + 1});
        if(nextHitBox.areOverlaid(level.obstacles)) {   // On the floor
            if (this.#vy > 0) {
                this.#secondJump = true;
                this.#vy = 0;
            }
                
            if (level.keys.upPressed && this.#vy === 0) {
                this.#vy = -this.#jumpBoost;
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
            }

            if (this.#vy < 0) {
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i > this.#vy*delta) {
                    i--;
                    nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: y0 + i});
                    if(!nextHitBox.areOverlaid(level.obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    else {
                        i = this.#vy*delta;
                    }
                }
                this.#vy += this.#weight*delta;
            }
        }
        else {  // In the void
            if (this.#secondJump && this.#upClicked && level.keys.upPressed) {  // Double jump
                this.#vy = -this.#jumpBoost/2;
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i > this.#vy*delta) {
                    i--;
                    nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: y0 + i});
                    if(!nextHitBox.areOverlaid(level.obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    else {
                        i = this.#vy*delta;
                    }
                }
                this.#secondJump = false;
                this.#vy += this.#weight*delta;
            }
            else if(this.#vy < 0) { // Jumping
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i > this.#vy*delta) {
                    i--;
                    nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: y0 + i});
                    if(!nextHitBox.areOverlaid(level.obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    else {
                        i = this.#vy*delta;
                    }
                }
                this.#vy += this.#weight*delta;
            }
            else {  // Falling
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i < this.#vy*delta) {
                    i++;
                    nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: y0 + i});
                    if(!nextHitBox.areOverlaid(level.obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    else {
                        i = this.#vy*delta;
                    }
                }
                this.#vy += this.#weight*delta;
            }
        }
        this.#upClicked = !level.keys.upPressed;
    }

    #updateAnimation(level: Level, delta: number) {
        if(this.#vy < -(this.#jumpBoost*0.9)) { // Jump
            this.#spriteTime = 0;
            this.#spriteFrame = 10;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else if(this.#vy < -(this.#jumpBoost*0.8)) {
            this.#spriteTime = 0;
            this.#spriteFrame = 11;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else if(this.#vy < -(this.#jumpBoost*0.2)) {
            this.#spriteTime = 0;
            this.#spriteFrame = 12;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else if(this.#vy < 0) {
            this.#spriteTime = 0;
            this.#spriteFrame = 13;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else if(this.#vy > 0) { // Fall
            if(!(this.#spriteFrame >= 14 && this.#spriteFrame < 16)) {
                this.#spriteTime = playerSpriteTime;
                this.#spriteFrame = 14;
                this.#animatedSprite.currentFrame = this.#spriteFrame;
            }
            else {
                this.#spriteTime -= delta;
                
                if(this.#spriteTime < 0) {
                    this.#spriteTime = playerSpriteTime;
                    this.#spriteFrame = (this.#spriteFrame - 14 + 1) % 2 + 14;
                    this.#animatedSprite.currentFrame = this.#spriteFrame;
                }
            }
        }
        else if(this.#vx != 0) {    // Run
            if(!(this.#spriteFrame >= 4 && this.#spriteFrame < 10)) {
                this.#spriteTime = playerSpriteTime / this.#speed;
                this.#spriteFrame = 4;
                this.#animatedSprite.currentFrame = this.#spriteFrame;
            }
            else {
                this.#spriteTime -= delta;
            
                if(this.#spriteTime < 0) {
                    this.#spriteTime = playerSpriteTime / this.#speed;
                    this.#spriteFrame = (this.#spriteFrame - 4 + 1) % 6 + 4;
                    this.#animatedSprite.currentFrame = this.#spriteFrame;
                }
            }
        }
        else if(this.#spriteFrame > 3) {    // Neutral
            this.#spriteTime = playerSpriteTime;
            this.#spriteFrame = 0;
            this.#animatedSprite.currentFrame = this.#spriteFrame;
        }
        else {
            this.#spriteTime -= delta;
            
            if(this.#spriteTime < 0) {
                this.#spriteTime = playerSpriteTime;
                this.#spriteFrame = (this.#spriteFrame + 1) % 4;
                this.#animatedSprite.currentFrame = this.#spriteFrame;
            }
        }

        // Orientation
        if(this.#vx > 0 && !this.#facingRight) {
            this.#facingRight = true;
            this.#animatedSprite.scale.x *= -1;
        }
        if(this.#vx < 0 && this.#facingRight) {
            this.#facingRight = false;
            this.#animatedSprite.scale.x *= -1;
        }
    }
}