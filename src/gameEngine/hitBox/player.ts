import { Sound } from "@pixi/sound";
import { AnimatedSprite, Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { assets } from "../..";
import { Coord, Coordinate } from "../patterns/coordinate";
import { HitBox } from "../patterns/hitBox";
import { Level } from "../patterns/level";

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

    #showHitBox: boolean;

    #hitBox: Graphics;
    #animatedSprite: AnimatedSprite;
    
    #textures: Texture[];

    #spriteTime: number = playerSpriteTime;
    #spriteFrame: number = 0;
    #facingRight: boolean = true;

    #step1: Sound | null = null;
    #step2: Sound | null = null;

    constructor(coordinate: Coord, resolution: number = 1, showHitBox: boolean = false) {
        super({coordinate: coordinate, width: playerWidth*(resolution), height: playerHeight*(resolution)});

        this.#showHitBox = showHitBox;
        if(this.#showHitBox) {
            this.#hitBox = new Graphics();
            this.#hitBox.beginFill(0x0000FF)
                        .drawRect(0, 0, this._width, this._height)
                        .endFill();
        }

        this.#textures = [
                    assets.adventurer.adventurerIdle00, // 0
                    assets.adventurer.adventurerIdle01, // 1
                    assets.adventurer.adventurerIdle02, // 2
                    assets.adventurer.adventurerIdle03, // 3

                    assets.adventurer.adventurerRun00,  // 4
                    assets.adventurer.adventurerRun01,  // 5
                    assets.adventurer.adventurerRun02,  // 6
                    assets.adventurer.adventurerRun03,  // 7
                    assets.adventurer.adventurerRun04,  // 8
                    assets.adventurer.adventurerRun05,  // 9
                
                    assets.adventurer.adventurerJump00, // 10
                    assets.adventurer.adventurerJump01, // 11
                    assets.adventurer.adventurerJump02, // 12
                    assets.adventurer.adventurerJump03, // 13

                    assets.adventurer.adventurerFall00, // 14
                    assets.adventurer.adventurerFall01  // 15
                ];

        this.#textures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });
        
        this.#animatedSprite = new AnimatedSprite(this.#textures);
        this.#animatedSprite.scale.set(resolution);

        this.#step1 = assets.adventurer.adventurerSoundStep00;
        this.#step2 = assets.adventurer.adventurerSoundStep01;
    }

    addToStage(level: Level) {
        this.#vx = 0;
        this.#secondJump = true;
        this.#vy = 0;

        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
            level.game.app.stage.addChild(this.#hitBox);
        }
        this.#animatedSprite.anchor.x = 0.5;
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + 8*(this._width/playerWidth);
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y - 6*(this._height/playerHeight);
        level.game.app.stage.addChild(this.#animatedSprite);
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
        this.#updateCoordinates(level, delta);
        this.#updateAnimation(level, delta);
    }

    #updateX(level: Level, delta: number) {
        if(level.game.keys.left.pressed && !level.game.keys.right.pressed)  // left
            this.#vx = -this.#speed;
        else if(!level.game.keys.left.pressed && level.game.keys.right.pressed) // right
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
                
            if (level.game.keys.up.pressed && this.#vy === 0) {
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
            if (this.#secondJump && level.game.keys.up.clicked && level.game.keys.up.pressed) {  // Double jump
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
    }
    
    #updateCoordinates(level: Level, delta: number) {
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
        }
        
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + 8*(this._width/playerWidth);
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y - 6*(this._height/playerHeight);
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
                this.#step1.play();
            }
            else {
                this.#spriteTime -= delta;
            
                if(this.#spriteTime < 0) {
                    this.#spriteTime = playerSpriteTime / this.#speed;
                    this.#spriteFrame = (this.#spriteFrame - 4 + 1) % 6 + 4;
                    this.#animatedSprite.currentFrame = this.#spriteFrame;

                    if(this.#spriteFrame == 4) this.#step1.play();
                    if(this.#spriteFrame == 7) this.#step2.play();
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