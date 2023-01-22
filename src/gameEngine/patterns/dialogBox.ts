import { Coordinate, Rect } from "./coordinate";
import { Level } from "./level";

export class DialogBox {
    _coordinate: Coordinate;
    _width: number;
    _height: number;

    _texts: string[];

    _isStarted: boolean = false;
    _stape: number = 0;

    constructor(rect: Rect, texts: string[]) {
        this._coordinate = new Coordinate(rect.coordinate);
        this._width = rect.width;
        this._height = rect.height;

        this._texts = texts;
    }

    get isStarted(): boolean { return this._isStarted; }

    start(level: Level) {
        throw "Redefine the start method!"
    }

    update(level: Level, delta: number) {
        throw "Redefine the update method!"
    }

    #end(level: Level) {
        throw "Redefine the end method!"
    }
}