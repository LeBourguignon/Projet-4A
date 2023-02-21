import { assets } from "../../../..";
import { Coordinate } from "../../../patterns/coordinate";
import { Level } from "../../../patterns/level";
import { Background } from "../hitBox/background";
import { Block } from "../hitBox/block";
import { Player } from "../hitBox/player";
import { Tenemigs, tenemigsHeight, tenemigsWidth } from "../hitBox/tenemigs";

export class PnjLevel extends Level {
    constructor(id: number = 0) {
        //Initialisation des hitbox
        const player = new Player({x: 0, y: 0});

        const tenemigs1 = new Tenemigs({x: 8*64-tenemigsWidth/2, y: 8*64-tenemigsHeight}, ["Je suis le premier Tenemigs!"]);
        const tenemigs2 = new Tenemigs({x: 4*64-tenemigsWidth/2, y: 6*64-tenemigsHeight}, ["Je suis le deuxième Tenemigs!"]);
        const tenemigs3 = new Tenemigs({x: 12*64-tenemigsWidth/2, y: 4*64-tenemigsHeight}, ["Je suis le troisième Tenemigs!"]);

        const background = new Background({coordinate: {x: 0, y: 0}, width: 16*64, height: 9*64});

        const floor1 = new Block({coordinate: {x: -16*64, y: 8*64}, width: 3*16*64, height: 64});
        const block11 = new Block({coordinate: {x: 2*64, y: 6*64}, width: 4*64, height: 16});
        const block12 = new Block({coordinate: {x: 10*64, y: 4*64}, width: 4*64, height: 16});
        
        super({
            size: {coordinate: {x: -16*64, y: 0}, width: 3*16*64, height: 9*64}, 
            drawables: [background, floor1, block11, block12, tenemigs1, tenemigs2, tenemigs3, player], 
            player: player, 
            obstacles: [floor1, block11, block12], 
            camCoordinate: new Coordinate({x: 0, y: 0}),
            theme: assets.theme.theme02
        }, id);
    }

    _updateCam(delta: number = 0) {

    }
}