import { Application, ICanvas } from "pixi.js";
import { Coordinate } from "./coordinate";
import { Level } from "./level";
import { Player } from "./player";
import { StaticColorBlock } from "./staticColorBlock";
import { Tenemigs, tenemigsHeight, tenemigsWidth } from "./tenemigs";

export class DevLevel extends Level {
    constructor(app: Application<ICanvas>) {
        //Initialisation des hitbox
        var player = new Player({x: 8*32, y: 0});
        var tenemigs = new Tenemigs({x: 24*32 - (tenemigsWidth/2), y: 8*32 - tenemigsHeight})

        var floor = new StaticColorBlock({coordinate: {x: -16*32, y: 8*32}, width: 3*16*32, height: 32}, 0x262626);
        var block1 = new StaticColorBlock({coordinate: {x: -8*32, y: 6*32}, width: 14*32, height: 8}, 0x262626);
        var block2 = new StaticColorBlock({coordinate: {x: 10*32, y: 4*32}, width: 14*32, height: 8}, 0x262626);
        var block3 = new StaticColorBlock({coordinate: {x: 4*32, y: 2*32}, width: 8*32, height: 8}, 0x262626);
        var wallLeft = new StaticColorBlock({coordinate: {x: -17*32, y: 0}, width: 32, height: 9*32}, 0x262626);
        var wallRight = new StaticColorBlock({coordinate: {x: 32*32, y: 0}, width: 32, height: 9*32}, 0x262626);
        
        super(app, {drawables: [floor, block1, block2, block3, tenemigs, player], player: player, obstacles: [floor, block1, block2, block3, wallLeft, wallRight], camCoordinate: new Coordinate({x: 0, y: 0})});
    }

    _updateCam(delta: number) {
        if(this._player._coordinate.x < 0 && this._camCoordinate.x != 16*32) {
            this._camCoordinate.x += 32;
        }
        else if(this._player._coordinate.x >= 0 && this._player._coordinate.x < 16*32 && this._camCoordinate.x != 0) {
            if(this._camCoordinate.x > 0)
                this._camCoordinate.x -= 32;
            if(this._camCoordinate.x < 0)
                this._camCoordinate.x += 32;
        }
        else if(this._player._coordinate.x >= 16*32 && this._camCoordinate.x != -16*32) {
            this._camCoordinate.x -= 32;
        }
    }
}