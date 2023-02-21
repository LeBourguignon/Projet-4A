import { Level0 } from "../levels/level0";
import { Game } from "../patterns/game";

export class Campaign extends Game {
    constructor(element: HTMLElement) {
        super(element, {width: 2*16*32, height: 2*9*32, resolution: 1}, [new Level0(1)])
    
        this._currentLevel = this._levels[0];
        this._currentLevel.addToStage(this);
    }

    _update(delta: number) {
        this._currentLevel.update(delta);

    }
}