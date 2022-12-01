import { Application, ICanvas } from "pixi.js";
import { Coordinate } from "../coordinate";
import { Level } from "../level";
import { Player } from "../hitBox/player";
import { StaticColorBlock } from "../hitBox/staticColorBlock";
import { Tenemigs, tenemigsHeight, tenemigsWidth } from "../hitBox/tenemigs";
import { Torch, torchHeight, torchWidth } from "../hitBox/torch";

export class DevLevelInTheDarkness extends Level {
    constructor(app: Application<ICanvas>) {
        //Initialisation des hitbox
        const player = new Player({x: 8*32, y: 0});
        const tenemigs = new Tenemigs({x: 24*32 - (tenemigsWidth/2), y: 8*32 - tenemigsHeight});
        const torch = new Torch({x: -8*32 - (torchWidth/2), y: 8*32 - torchHeight});

        const background = new StaticColorBlock({coordinate: {x: -16*32, y: 0}, width: 3*16*32, height: 9*32}, 0x262626);

        const floor = new StaticColorBlock({coordinate: {x: -16*32, y: 8*32}, width: 3*16*32, height: 32}, 0xD9D9D9);
        const block1 = new StaticColorBlock({coordinate: {x: -8*32, y: 6*32}, width: 14*32, height: 8}, 0xD9D9D9);
        const block2 = new StaticColorBlock({coordinate: {x: 10*32, y: 4*32}, width: 14*32, height: 8}, 0xD9D9D9);
        const block3 = new StaticColorBlock({coordinate: {x: 4*32, y: 2*32}, width: 8*32, height: 8}, 0xD9D9D9);

        super(app, {size: {coordinate: {x: -16*32, y: 0}, width: 3*16*32, height: 9*32}, drawables: [background, floor, block1, block2, block3, tenemigs, player, torch], player: player, obstacles: [floor, block1, block2, block3], camCoordinate: new Coordinate({x: 0, y: 0}), inTheDarkness: true});
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
