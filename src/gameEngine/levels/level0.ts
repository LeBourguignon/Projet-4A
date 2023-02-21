import { BackgroundTest } from "../hitBox/level-0/backgroundTest";
import { Test } from "../hitBox/level-0/test";
import { Player, playerWidth } from "../hitBox/player";
import { Coordinate } from "../patterns/coordinate";
import { HitBox } from "../patterns/hitBox";
import { Level } from "../patterns/level";

export class Level0 extends Level {
    constructor(id: number = 0) {
        //Initialisation des hitbox
        const player = new Player({x: 16*32 - playerWidth/2, y: 0}, 2);

        const floor = new HitBox({coordinate: {x: 0, y: 13*32}, width: 19*32, height: 32});

        const test = new Test({x: 0, y: 0});
        const background = new BackgroundTest({x: 0, y: 0});
        
        super({
            size: {coordinate: {x: 0, y: 0}, width: 5*16*2*32, height: 3*9*2*32}, 
            drawables: [background, player, test], 
            player: player, 
            obstacles: [floor], 
            camCoordinate: new Coordinate({x: 0, y: 0}),
            theme: null
        }, id);
    }

    _updateCam(delta: number = 0) {

    }
}