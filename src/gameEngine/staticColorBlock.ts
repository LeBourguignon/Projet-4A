import { HitBox, Rectangle } from "./hitBox.js";

export class StaticColorBlock extends HitBox {
    #color: string;

    constructor(hitBox: Rectangle, color: string) {
        super(hitBox);
        this.#color = color;
    }

    set color(value: string) { this.#color = value; }
    get color(): string { return this.#color; }
    
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(this.coordinate.x, this.coordinate.y, this.width, this.height);
        ctx.fillStyle = this.#color;
        ctx.fill();
        ctx.closePath();
    }
}