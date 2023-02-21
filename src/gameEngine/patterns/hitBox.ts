import { Graphics, Sprite } from "pixi.js";
import { Coordinate, Rect } from "./coordinate";
import { Level } from "./level";

export class HitBox {
    _coordinate: Coordinate;
    _width: number;
    _height: number;

    constructor(rect: Rect) {
        this._coordinate = new Coordinate(rect.coordinate);
        this._width = rect.width;
        this._height = rect.height;
    }

    set coordinate(value: Coordinate) { this._coordinate = value; }
    get coordinate(): Coordinate { return this._coordinate; }

    set width(value: number) { this._width = value; }
    get width(): number { return this._width; }

    set height(value: number) { this._height = value; }
    get height(): number { return this._height; }

    addToStage(level: Level) {
        throw "Redefine the addToStage method!"
    }

    addLighting(level: Level, lighting: Graphics) {
        
    }

    setMask(mask: Sprite) {
        throw "Redefine the setMask method!"
    }

    update(level: Level, delta: number) {
        throw "Redefine the update method!"
    }

    isOverlaid(hitBox: HitBox): Boolean {
        return this.coordinate.x + this.width > hitBox.coordinate.x && this.coordinate.x < hitBox.coordinate.x + hitBox.width && this.coordinate.y + this.height > hitBox.coordinate.y && this.coordinate.y < hitBox.coordinate.y + hitBox.height;
    }

    areOverlaid(hitBoxs: HitBox[]): Boolean {
        var output = false
        hitBoxs.forEach(hitBox => {
            if (this.isOverlaid(hitBox)) {
                output = true;
            }
        });
        return output;
    }
};