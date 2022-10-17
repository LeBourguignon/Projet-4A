import { Coordinate } from "./coordinate.js";

export class HitBox {
    _coordinate;
    
    _width;
    _height;

    constructor(hitBox) {
        this._coordinate = new Coordinate(hitBox.coordinate);
        
        this._width = hitBox.width;
        this._height = hitBox.height;
    }

    set coordinate(value) { this._coordinate = new Coordinate(value); }
    get coordinate() { return new Coordinate(this._coordinate); }

    set width(value) { this._width = value; }
    get width() { return this._width; }

    set height(value) { this._height = value; }
    get height() { return this._height; }

    draw() {
        throw "Redefine the draw method!"
    }
}

export function isOverlaid(hitBox, obstacles) {
    obstacles.forEach(obstacle => {
        if (hitBox.coordinate.x + hitBox.width > obstacle.coordinate.x && hitBox.coordinate.x < obstacle.coordinate.x + obstacle.width && hitBox.coordinate.y + hitBox.height > obstacle.coordinate.y && hitBox.coordinate.y < obstacle.coordinate.y + obstacle.height) {
            return true;
        }
    });
    return false;
}