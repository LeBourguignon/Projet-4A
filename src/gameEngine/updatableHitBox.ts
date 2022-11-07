import { HitBox, Rectangle } from "./hitBox.js";
import { Level } from "./level.js";

export class UpdatableHitBox extends HitBox {
    constructor(hitBox: Rectangle) {
        super(hitBox);
    }

    update(level: Level) {
        throw "Redefine the update method!"
    }
}