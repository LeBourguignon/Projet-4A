import { Graphics, Sprite } from "pixi.js";
import { Coord, Coordinate } from "./coordinate";
import { Level } from "./level";

export type Rect = { coordinate: Coord, width: number, height: number }

export class HitBox {
    _coordinate: Coordinate;
    _width: number;
    _height: number;

    constructor(hitBox: Rect) {
        this._coordinate = new Coordinate(hitBox.coordinate);
        this._width = hitBox.width;
        this._height = hitBox.height;
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

    addLighting(level: Level) {
        throw "Redefine the addLighting method!"
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
}