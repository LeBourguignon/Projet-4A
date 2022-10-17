import { HitBox } from "./hitBox.js";

export class Block extends HitBox {
    constructor(coordinate, width, height) {
        super(new HitBox({ coordinate: coordinate, width: width, height: height}));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.coordinate.x, this.coordinate.y, this.width, this.height);
        ctx.fillStyle = "#262626";
        ctx.fill();
        ctx.closePath();
    }
}