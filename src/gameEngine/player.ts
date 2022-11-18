import { AnimatedSprite, Graphics, ObservablePoint, Sprite, Texture } from "pixi.js";
import { Coord, Coordinate } from "./coordinate";
import { HitBox } from "./hitBox";
import { Level } from "./level";

export const playerWidth = 75;
export const playerHeight = 150;

export const playerSpeed = 5;
export const playerJumpBoost = 20;
export const playerWeight = 1;

export class Player extends HitBox {
    #speed: number = playerSpeed;
    #jumpBoost: number = playerJumpBoost;
    #weight: number = playerWeight;

    #vx: number = 0;
    #vy: number = 0;
    #secondJump: boolean = false;
    #upClicked: boolean = false;

    #graphics: Graphics;
    #currentSprite: AnimatedSprite;
    #idle: Texture[];
    #spriteTime: number = 25;
    #spriteNumber: number = 0;

    constructor(coordinate: Coord) {
        super({coordinate: coordinate, width: playerWidth, height: playerHeight});

        this.#graphics = new Graphics();
        this.#graphics.beginFill(0x0000FF);
        this.#graphics.drawRect(0, 0, this._width, this._height);
        this.#graphics.endFill();

        this.#idle = [Texture.from('assets/player/idle/adventurer-idle-00.png'), Texture.from('assets/player/idle/adventurer-idle-01.png'), Texture.from('assets/player/idle/adventurer-idle-02.png'), Texture.from('assets/player/idle/adventurer-idle-03.png')];
        
        this.#currentSprite = new AnimatedSprite(this.#idle);
        this.#currentSprite.scale.set(5, 5);
    }

    addToStage(level: Level) {
        this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
        this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
        //level.app.stage.addChild(this.#graphics);
        this.#currentSprite.x = this._coordinate.x + level.camCoordinate.x;
        this.#currentSprite.y = this._coordinate.y + level.camCoordinate.y;
        level.app.stage.addChild(this.#currentSprite);
    }

    update(level: Level, delta: number) {
        this.#updateX(level, delta);
        this.#updateY(level, delta);
        this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
        this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
        this.#currentSprite.x = this._coordinate.x + level.camCoordinate.x - 85;
        this.#currentSprite.y = this._coordinate.y + level.camCoordinate.y - 30;
        this.#updateAnimation(level, delta);
        level.app.stage.addChild(this.#currentSprite);
    }

    #updateX(level: Level, delta: number) {
        if(level.keys.leftPressed && !level.keys.rightPressed) // left
            this.#vx = -this.#speed;
        else if(!level.keys.leftPressed && level.keys.rightPressed) // right
            this.#vx = this.#speed;
        else // neutral
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
        if (level.keys.downPressed)
            this.#weight = playerWeight*2;
        else
            this.#weight = playerWeight;
            
        var nextHitBox = new HitBox(this);
        nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: nextHitBox.coordinate.y + 1});
        if(nextHitBox.areOverlaid(level.obstacles)) {
            if (this.#vy > 0) {
                this.#secondJump = true;
                this.#vy = 0;
            }
                
            if (level.keys.upPressed && this.#vy === 0) {
                this.#vy = -this.#jumpBoost;
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
        else {
            if (this.#secondJump && this.#upClicked && level.keys.upPressed) {
                this.#vy = -this.#jumpBoost;
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
            else if(this.#vy < 0) {
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
            else {
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
        this.#spriteTime -= delta;
        if(this.#spriteTime < 0) {
            this.#spriteTime = 25;
            this.#spriteNumber = (this.#spriteNumber + 1) % this.#idle.length;
            this.#currentSprite.currentFrame = this.#spriteNumber;
        }

        if(this.#vx == 0 && this.#vy == 0) {

        }
    }
}