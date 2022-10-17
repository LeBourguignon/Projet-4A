import { HitBox, isOverlaid } from "./hitBox.js";

export class Player extends HitBox {
    #speed = 5;
    #jumpBoost = 20;

    #jumping = 0;
    #falling = 0;

    constructor(coordinate) {
        super(new HitBox({ coordinate: coordinate, width: 20, height: 20}));
    }

    #right(canvas, obstacles, rightPressed) {
        if(rightPressed && this._coordinate.x < canvas.width - this._width) {
            var nextHitBox = new HitBox(this);
            var i = 0, x0 = this._coordinate.x;
            while(i < this.#speed) {
                i++;
                nextHitBox.coordinate.x = x0 + i;
                if(!isOverlaid(nextHitBox, obstacles)) {
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
                nextHitBox.coordinate.x = x0 - i;
                if(!isOverlaid(nextHitBox, obstacles)) {
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
        nextHitBox.coordinate.y++;
        if(isOverlaid(nextHitBox, obstacles)) {
            if(this.#falling > 0) {
                this.#falling = 0;
            }
            if(upPressed) {
                this.#jumping = this.#jumpBoost;
            }
        }
        else {
            if(upPressed && this.#jumping > 0) {
                nextHitBox = new HitBox(this);
                var i = this.#jumpBoost, y0 = this._coordinate.y;
                while(i > 0) {
                    nextHitBox.coordinate.y = y0 - i;
                    if(!isOverlaid(nextHitBox, obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                    }
                    i--;
                }
            }
            else {
                this.#jumping = 0;
                nextHitBox = new HitBox(this);
                var i = 0, y0 = this._coordinate.y;
                while(i < this.#falling) {
                    i++;
                    nextHitBox.coordinate.y = y0 + i;
                    if(!isOverlaid(nextHitBox, obstacles)) {
                        this._coordinate.y = nextHitBox.coordinate.y;
                        console.log(nextHitBox.coordinate.y);
                    }
                    else {
                        i = this.#falling;
                    }
                }
                this.#falling++;
            }
        }
    }

    update(canvas, obstacles, rightPressed, leftPressed, upPressed) {
        this.#right(canvas, obstacles, rightPressed);
        this.#left(canvas, obstacles, leftPressed);
        this.#fallAndJump(canvas, obstacles, upPressed);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this._coordinate.x, this._coordinate.y, this._width, this._height);
        ctx.fillStyle = "#0000FF";
        ctx.fill();
        ctx.closePath();
    }
}