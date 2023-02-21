import { Coordinate } from "../../patterns/coordinate";
import { Game } from "../../patterns/game";
import { LevelInTheDarkness } from "./levels/levelInTheDarkness";
import { PlayerAndCamLevel } from "./levels/playerAndCamLevel";
import { PnjLevel } from "./levels/pnjLevel";

export class DevGame extends Game {
    constructor(element: HTMLElement) {
        super(element, {width: 16*64, height: 9*64, resolution: 1}, [new PlayerAndCamLevel(1), new LevelInTheDarkness(2), new PnjLevel(3)]);
    }

    _update(delta: number) {
        this._currentLevel.update(delta);

        // Vers la droite
        if(this._currentLevel.id == 1 && this._currentLevel.player.coordinate.x > 48*64) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[1];
            this._currentLevel.player.coordinate = new Coordinate({x: 2*64, y: 0});
            this._currentLevel.camCoordinate = new Coordinate({x: 0, y: 0});
            this._currentLevel.addToStage(this);
        }

        if(this._currentLevel.id == 2 && this._currentLevel.player.coordinate.x > 48*64) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[2];
            this._currentLevel.player.coordinate = new Coordinate({x: 2*64, y: 0});
            this._currentLevel.camCoordinate = new Coordinate({x: 0, y: 0});
            this._currentLevel.addToStage(this);
        }

        if(this._currentLevel.id == 3 && this._currentLevel.player.coordinate.x > 16*64) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[0];
            this._currentLevel.player.coordinate = new Coordinate({x: 2*64, y: 0});
            this._currentLevel.camCoordinate = new Coordinate({x: 0, y: 0});
            this._currentLevel.addToStage(this);
        }

        // Vers la gauche
        if(this._currentLevel.id == 1 && this._currentLevel.player.coordinate.x < 0) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[2];
            this._currentLevel.player.coordinate = new Coordinate({x: 14*64, y: 0});
            this._currentLevel.camCoordinate = new Coordinate({x: 0, y: 0});
            this._currentLevel.addToStage(this);
        }

        if(this._currentLevel.id == 2 && this._currentLevel.player.coordinate.x < 0) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[0];
            this._currentLevel.player.coordinate = new Coordinate({x: 46*64, y: 18*64});
            this._currentLevel.camCoordinate = new Coordinate({x: 32*64, y: 18*64});
            this._currentLevel.addToStage(this);
        }

        if(this._currentLevel.id == 3 && this._currentLevel.player.coordinate.x < 0) {
            this._currentLevel.removeToStage();
            this._currentLevel = this._levels[1];
            this._currentLevel.player.coordinate = new Coordinate({x: 46*64, y: 18*64});
            this._currentLevel.camCoordinate = new Coordinate({x: 32*64, y: 18*64});
            this._currentLevel.addToStage(this);
        }
    }
}