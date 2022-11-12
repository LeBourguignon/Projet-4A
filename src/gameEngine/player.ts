import { Graphics } from "pixi.js";
import { Coord, Coordinate } from "./coordinate";
import { HitBox } from "./hitBox";
import { Level } from "./level";

export const playerWidth = 30;
export const playerHeight = 30;

export const playerSpeed = 20;
export const playerJumpBoost = 60;
export const playerWeight = 5;

export class Player extends HitBox {
    #speed: number = playerSpeed;
    #jumpBoost: number = playerJumpBoost;
    #weight: number = playerWeight;

    #vy: number = 0;
    #secondJump: boolean = false;

    #graphics: Graphics;

    constructor(coordinate: Coord) {
        super({coordinate: coordinate, width: playerWidth, height: playerHeight});

        this.#graphics = new Graphics();
        this.#graphics.beginFill(0x0000FF);
        this.#graphics.drawRect(0, 0, this._width, this._height);
        this.#graphics.endFill();
    }

    addToStage(level: Level) {
        this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
        this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
        level.app.stage.addChild(this.#graphics);
    }

    update(level: Level, delta: number) {
        this.#updateX(level, delta);
        this.#updateY(level, delta);
        this.#graphics.x = this._coordinate.x + level.camCoordinate.x;
        this.#graphics.y = this._coordinate.y + level.camCoordinate.y;
    }

    #updateX(level: Level, delta: number) {
        //Gauche
        if(level.keys.leftPressed && !level.keys.rightPressed) {
            var nextHitBox = new HitBox(this);
            var i = 0, x0 = this._coordinate.x;
            while(i < this.#speed*delta) {
                i++;
                nextHitBox.coordinate = new Coordinate({x: x0 - i, y: nextHitBox.coordinate.y});
                if(!nextHitBox.areOverlaid(level.obstacles)) {
                    this._coordinate.x = nextHitBox.coordinate.x;
                }
                else {
                    i = this.#speed*delta;
                }
            }
        }
        //Droite
        else if(!level.keys.leftPressed && level.keys.rightPressed) {
            var nextHitBox = new HitBox(this);
            var i = 0, x0 = this._coordinate.x;
            while(i < this.#speed*delta) {
                i++;
                nextHitBox.coordinate = new Coordinate({x: x0 + i, y: nextHitBox.coordinate.y});
                if(!nextHitBox.areOverlaid(level.obstacles)) {
                    this._coordinate.x = nextHitBox.coordinate.x;
                }
                else {
                    i = this.#speed*delta;
                }
            }
        }
    }

    #updateY(level: Level, delta: number) {
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
            if (this.#secondJump && level.keys.upPressed && this.#vy > -this.#jumpBoost/8) {
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
    }
}