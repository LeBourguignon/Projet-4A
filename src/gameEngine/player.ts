import { Coord, Coordinate } from "./coordinate.js";
import { HitBox } from "./hitBox.js";
import { Level } from "./level.js";
import { UpdatableHitBox } from "./updatableHitBox.js";

export const playerWidth = 20;
export const playerHeight = 20;

export class Player extends UpdatableHitBox {
    #speed: number = 5;
    #jumpBoost: number = 20;

    #jumping: number = 0;
    #falling: number = 0;

    constructor(coordinate: Coord) {
        super({coordinate: coordinate, width: playerWidth, height: playerHeight});
    }

    #right(canvas, obstacles, rightPressed) {
        if(rightPressed && this._coordinate.x < canvas.width - this._width) {
            var nextHitBox = new HitBox(this);
            var i = 0, x0 = this._coordinate.x;
            while(i < this.#speed) {
                i++;
                nextHitBox.coordinate = new Coordinate({x: x0 + i, y: nextHitBox.coordinate.y});
                if(!nextHitBox.areOverlaid(obstacles)) {
                    this._coordinate.x = nextHitBox.coordinate.x;
                }
                else {
                    i = this.#speed;
                }
            }
        }
    }

    #left(canvas, obstacles, leftPressed) {
        if(leftPressed && this._coordinate.x > 0) {
            var nextHitBox = new HitBox(this);
            var i = 0, x0 = this._coordinate.x;
            while(i < this.#speed) {
                i++;
                nextHitBox.coordinate = new Coordinate({x: x0 - i, y: nextHitBox.coordinate.y});
                if(!nextHitBox.areOverlaid(obstacles)) {
                    this._coordinate.x = nextHitBox.coordinate.x;
                }
                else {
                    i = this.#speed;
                }
            }
        }
    }

    #fallAndJump(canvas, obstacles, upPressed) {
        var nextHitBox = new HitBox(this);
        nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: nextHitBox.coordinate.y + 1});
        if(nextHitBox.areOverlaid(obstacles)) {
            if(this.#falling > 0) {
                this.#falling = 0;
            }
            if(upPressed) {
                this.#jumping = this.#jumpBoost;
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i < this.#jumping) {
                    nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: y0 - i});
                    if(!nextHitBox.areOverlaid(obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    else {
                        i = this.#jumping;
                    }
                    i++;
                }
                this.#jumping--;
            }
        }
        else {
            if(upPressed && this.#jumping > 0) {
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i < this.#jumping) {
                    nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: y0 - i});
                    if(!nextHitBox.isOverlaid(obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    else {
                        i = this.#jumping;
                    }
                    i++;
                }
                this.#jumping--;
            }
            else {
                this.#jumping = 0;
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i < this.#falling && this.#falling < canvas.height) {
                    i++;
                    nextHitBox.coordinate = new Coordinate({x: nextHitBox.coordinate.x, y: y0 + i});
                    if(!nextHitBox.areOverlaid(obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    else {
                        i = this.#falling;
                    }
                }
                this.#falling++;
            }
        }
    }

    update(level: Level) {
        this.#right(level.canvas, level.obstacles, level.keys.rightPressed);
        this.#left(level.canvas, level.obstacles, level.keys.leftPressed);
        this.#fallAndJump(level.canvas, level.obstacles, level.keys.upPressed);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(this._coordinate.x, this._coordinate.y, this._width, this._height);
        ctx.fillStyle = "#0000FF";
        ctx.fill();
        ctx.closePath();
    }
}