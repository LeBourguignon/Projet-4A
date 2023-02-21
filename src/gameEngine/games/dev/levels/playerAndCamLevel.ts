import { assets } from "../../../..";
import { Coordinate } from "../../../patterns/coordinate";
import { Level } from "../../../patterns/level";
import { Background } from "../hitBox/background";
import { Block } from "../hitBox/block";
import { Player } from "../hitBox/player";

export class PlayerAndCamLevel extends Level {
    constructor(id: number = 0) {
        //Initialisation des hitbox
        const player = new Player({x: 4*64, y: 4*64});

        const background = new Background({coordinate: {x: 0, y: 0}, width: 3*16*64, height: 3*9*64});

        const floor1 = new Block({coordinate: {x: -16*64, y: 8*64}, width: 3.5*16*64, height: 64});
        const block11 = new Block({coordinate: {x: 10*64, y: 6*64}, width: 12*64, height: 16});
        const block12 = new Block({coordinate: {x: 26*64, y: 4*64}, width: 12*64, height: 16});

        const floor2 = new Block({coordinate: {x: 0.5*16*64, y: 17*64}, width: 2.5*16*64, height: 64});
        const block21 = new Block({coordinate: {x: 26*64, y: 15*64}, width: 12*64, height: 16});
        const block22 = new Block({coordinate: {x: 10*64, y: 13*64}, width: 12*64, height: 16});

        const block23 = new Block({coordinate: {x: 46*64, y: 15*64}, width: 2*64, height: 16});
        const block24 = new Block({coordinate: {x: 43*64, y: 13*64}, width: 2*64, height: 16});
        const block25 = new Block({coordinate: {x: 46*64, y: 11*64}, width: 2*64, height: 16});
        const block26 = new Block({coordinate: {x: 43*64, y: 9*64}, width: 2*64, height: 16});
        
        const floor3 = new Block({coordinate: {x: 0, y: 26*64}, width: 4*16*64, height: 64});
        const block31 = new Block({coordinate: {x: 10*64, y: 24*64}, width: 12*64, height: 16});
        const block32 = new Block({coordinate: {x: 26*64, y: 22*64}, width: 12*64, height: 16});

        const block33 = new Block({coordinate: {x: 0*64, y: 24*64}, width: 2*64, height: 16});
        const block34 = new Block({coordinate: {x: 3*64, y: 22*64}, width: 2*64, height: 16});
        const block35 = new Block({coordinate: {x: 0*64, y: 20*64}, width: 2*64, height: 16});
        const block36 = new Block({coordinate: {x: 3*64, y: 18*64}, width: 2*64, height: 16});

        const wallRight = new Block({coordinate: {x: 3*16*64-16, y: 0}, width: 16, height: 2*9*64});
        const wallLeft = new Block({coordinate: {x: 0, y: 9*64}, width: 16, height: 2*9*64});
        
        super({
            size: {coordinate: {x: -16*64, y: 0}, width: 5*16*64, height: 3*9*64}, 
            drawables: [
                background, 
                floor1, block11, block12, 
                floor2, block21, block22, block23, block24, block25, block26, 
                floor3, block31, block32, block33, block34, block35, block36,
                wallRight, wallLeft, 
                player
            ], 
            player: player, 
            obstacles: [
                floor1, block11, block12, 
                floor2, block21, block22, block23, block24, block25, block26, 
                floor3, block31, block32, block33, block34, block35, block36, 
                wallRight, wallLeft
            ], 
            camCoordinate: new Coordinate({x: 0, y: 0}),
            theme: assets.theme.theme02
        }, id);
    }

    _updateCam(delta: number = 0) {
        // Floor 1 - scene by scene
        if(this._player.coordinate.y >= 0 && this._player.coordinate.y < 9*64) {
            if(this._camCoordinate.y != 0)
                this._camCoordinate.y += Math.sign(0 - this._camCoordinate.y) * Math.min(64*delta, Math.abs(0 - this._camCoordinate.y));

            if(this._player._coordinate.x < 16*64 && this._camCoordinate.x != 0)
                this._camCoordinate.x += Math.sign(0 - this._camCoordinate.x) * Math.min(64*delta, Math.abs(0 - this._camCoordinate.x));

            else if(this._player._coordinate.x >= 16*64 && this._player._coordinate.x < 32*64 && this._camCoordinate.x != 16*64)
                this._camCoordinate.x += Math.sign(16*64 - this._camCoordinate.x) * Math.min(64*delta, Math.abs(16*64 - this._camCoordinate.x));

            else if(this._player._coordinate.x >= 32*64 && this._camCoordinate.x != 32*64)
                this._camCoordinate.x += Math.sign(32*64 - this._camCoordinate.x) * Math.min(64*delta, Math.abs(32*64 - this._camCoordinate.x));
        }
        // Floor 2 - fixed
        else if(this._player.coordinate.y >= 9*64 && this._player.coordinate.y < 18*64) {
            if(this._camCoordinate.y != 9*64)
                this._camCoordinate.y += Math.sign(9*64 - this._camCoordinate.y) * Math.min(64*delta, Math.abs(9*64 - this._camCoordinate.y));

            if(this._player.coordinate.x >= 8*64 && this._player.coordinate.x < 40*64)
                this._camCoordinate.x = this._player.coordinate.x - 8*64;
            
            else if(this._player.coordinate.x < 8*64)
                this._camCoordinate.x = 0;

            else if(this._player.coordinate.x >= 40*64)
                this._camCoordinate.x = 32*64;
        }
        // Floor 3 - semi-fixed
        else if(this._player.coordinate.y >= 18*64 && this._player.coordinate.y < 27*64) {
            if(this._camCoordinate.y != 18*64)
                this._camCoordinate.y += Math.sign(18*64 - this._camCoordinate.y) * Math.min(64*delta, Math.abs(18*64 - this._camCoordinate.y));

            if(this._player.coordinate.x >= 4*64 && this._player.coordinate.x < 44*64) {
                if(this._player.coordinate.x - this._camCoordinate.x < 4*64)
                    this._camCoordinate.x = this._player.coordinate.x - 4*64;

                else if(this._player.coordinate.x - this._camCoordinate.x > 12*64)
                    this._camCoordinate.x = this._player.coordinate.x - 12*64;
            }             
        }
    }
}