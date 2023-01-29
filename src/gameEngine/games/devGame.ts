import { playerHeight, playerWidth } from "../hitBox/player";
import { DevLevel } from "../levels/devLevel";
import { DevLevelInTheDarkness } from "../levels/devLevelInTheDarkness";
import { Coordinate } from "../patterns/coordinate";
import { Game } from "../patterns/game";

export class DevGame extends Game {
    constructor(element: HTMLElement) {
        super(element, {width: 16*32, height: 9*32, resolution: 2}, [new DevLevel(1), new DevLevelInTheDarkness(2)]);
    }

    _update(delta: number) {
        this._currentLevel.update(delta);

        if(this._currentLevel.id == 1 && this._currentLevel.player.coordinate.x > 32*32) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[1];
            this._currentLevel.player.coordinate = new Coordinate({x: -16*32, y: 8*32-playerHeight});
            this._currentLevel.addToStage(this);
        }

        if(this._currentLevel.id == 2 && this._currentLevel.player.coordinate.x < -16*32) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[0];
            this._currentLevel.player.coordinate = new Coordinate({x: 32*32-playerWidth, y: 8*32-playerHeight});
            this._currentLevel.addToStage(this);
        }
    }
}