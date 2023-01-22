import { Coordinate } from "../patterns/coordinate";
import { Level } from "../patterns/level";
import { Player, playerHeight, playerWidth } from "../hitBox/player";
import { StaticColorBlock } from "../hitBox/staticColorBlock";
import { assets } from "../..";
import { DevTenemigs, tenemigsHeight, tenemigsWidth } from "../hitBox/dev/devTenemigs";

export class DevLevel extends Level {
    constructor(id: number = 0) {
        //Initialisation des hitbox
        const player = new Player({x: 8*32-playerWidth/2, y: 0}, 1);
        const tenemigs = new DevTenemigs({x: 24*32 - (tenemigsWidth/2), y: 8*32 - tenemigsHeight}, ["Jour 1", "Jour 2"]);

        const background = new StaticColorBlock({coordinate: {x: -16*32, y: 0}, width: 3*16*32, height: 9*32}, 0xD9D9D9);

        const floor = new StaticColorBlock({coordinate: {x: -16*32, y: 8*32}, width: 4*16*32, height: 32}, 0x262626);
        const block1 = new StaticColorBlock({coordinate: {x: -8*32, y: 6*32}, width: 14*32, height: 8}, 0x262626);
        const block2 = new StaticColorBlock({coordinate: {x: 10*32, y: 4*32}, width: 14*32, height: 8}, 0x262626);
        const block3 = new StaticColorBlock({coordinate: {x: 4*32, y: 2*32}, width: 8*32, height: 8}, 0x262626);
        
        super({
            size: {coordinate: {x: -16*32, y: 0}, width: 4*16*32, height: 9*32}, 
            drawables: [background, floor, block1, block2, block3, tenemigs, player], 
            player: player, 
            obstacles: [floor, block1, block2, block3], 
            camCoordinate: new Coordinate({x: 0, y: 0}),
            theme: assets.theme.theme02
        }, id);
    }

    _updateCam(delta: number = 0) {
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