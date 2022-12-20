import { DevLevel } from "../levels/devLevel";
import { DevLevelInTheDarkness } from "../levels/devLevelInTheDarkness";
import { Game } from "../patterns/game";

export class DevGame extends Game {
    constructor(element: HTMLElement) {
        super(element, [new DevLevel(1), new DevLevelInTheDarkness(2)]);
        
        this._currentLevel = this._levels[0];
        this._currentLevel.addToStage(this);
    }

    _update(delta: number) {
        this._currentLevel.update(delta);

        if(this._currentLevel.id == 1 && this._currentLevel.player.coordinate.x > 32*32) {
            this._currentLevel = this._levels[1];
            this._clearStage();
            this._currentLevel.addToStage(this);
        }

        if(this._currentLevel.id == 2 && this._currentLevel.player.coordinate.x < -16*32) {
            this._currentLevel = this._levels[0];
            this._clearStage();
            this._currentLevel.addToStage(this);
        }

        //console.log(this._currentLevel.id);
        //console.log(this._currentLevel.player.coordinate.x);
    }
}