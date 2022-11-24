import { Application, ICanvas } from "pixi.js";
import { Coordinate } from "./coordinate";
import { HitBox } from "./hitBox";
import { Player } from "./player";

export type Keys = { upPressed: Boolean, downPressed: Boolean, rightPressed: boolean, leftPressed: Boolean }
export type Map = { drawables: HitBox[], obstacles: HitBox[], player: Player, camCoordinate: Coordinate }

export class Level {
    _app: Application<ICanvas>
    _keys: Keys;

    _drawables: HitBox[]
    _obstacles: HitBox[];
    _player: Player;

    _camCoordinate: Coordinate;
    _elapsed = 0.0;

    constructor(app: Application<ICanvas>, level: Map) {
        this._app = app;
        this._keys = { upPressed: false, downPressed: false, rightPressed: false, leftPressed: false};

        this._drawables = level.drawables;
        this._player = level.player;
        this._obstacles = level.obstacles;
        this._camCoordinate = level.camCoordinate;

        this._drawables.forEach(drawable => {
            drawable.addToStage(this);
        });
    }

    set app(value: Application<ICanvas>) { this._app = value; }
    get app(): Application<ICanvas> { return this._app; }

    set keys(value: Keys) { this._keys = value; }
    get keys(): Keys { return this._keys; }

    set drawables(value: HitBox[]) { this._drawables = value; }
    get drawables(): HitBox[] { return this._drawables; }

    set player(value: Player) { this._player = value; }
    get player(): Player { return this._player; }
    
    set obstacles(value: HitBox[]) { this._obstacles = value; }
    get obstacles(): HitBox[] { return this._obstacles; }

    set camCoordinate(value: Coordinate) { this._camCoordinate = value; }
    get camCoordinate(): Coordinate { return this._camCoordinate; }

    update(delta: number) {
        this._elapsed += delta;
        this._updateCam(delta);
        this._drawables.forEach(drawable => {
            drawable.update(this, delta);
        });
    }

    _updateCam(delta: number) {
        throw "Redefine the updateCam method!"
    }
}