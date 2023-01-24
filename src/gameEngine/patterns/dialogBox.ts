import { Coordinate, Rect } from "./coordinate";
import { Level } from "./level";

export class DialogBox {
    _coordinate: Coordinate;
    _width: number;
    _height: number;

    _texts: string[];

    _isStarted: boolean = false;
    _firstUpdate: boolean = false;
    _stape: number = 0;

    constructor(rect: Rect, texts: string[]) {
        this._coordinate = new Coordinate(rect.coordinate);
        this._width = rect.width;
        this._height = rect.height;

        this._texts = texts;
    }

    get isStarted(): boolean { return this._isStarted; }

    start(level: Level) {
        if(this._texts.length) {
            this._addToStage(level);

            this._isStarted = true;
            level.ongoingDialog = true;
            this._firstUpdate = true;
        }
        else
            throw "Give text for the dialog box!"
    }

    _addToStage(level: Level) {
        throw "Redefine the _addToStage method!"
    }

    update(level: Level, delta: number) {
        throw "Redefine the update method!"
    }

    end(level: Level) {
        this._removeToStage(level);
        this._isStarted = false;
        level.ongoingDialog = false;
    }

    _removeToStage(level: Level) {
        throw "Redefine the _removeToStage method!"
    }
}