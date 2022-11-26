import { Application, filters, Graphics, ICanvas, Rectangle, SCALE_MODES, Texture, RenderTexture, Sprite } from "pixi.js";
import { Coordinate } from "./coordinate";
import { Level } from "./level";
import { Player } from "./player";
import { StaticColorBlock } from "./staticColorBlock";
import { Tenemigs, tenemigsHeight, tenemigsWidth } from "./tenemigs";

export class DevLevelInTheDarkness extends Level {
    #focus: Sprite;

    constructor(app: Application<ICanvas>) {
        //Initialisation des hitbox
        var player = new Player({x: 8*32, y: 0});
        var tenemigs = new Tenemigs({x: 24*32 - (tenemigsWidth/2), y: 8*32 - tenemigsHeight})

        var floor = new StaticColorBlock({coordinate: {x: -16*32, y: 8*32}, width: 3*16*32, height: 32}, 0xD9D9D9);
        var block1 = new StaticColorBlock({coordinate: {x: -8*32, y: 6*32}, width: 14*32, height: 8}, 0xD9D9D9);
        var block2 = new StaticColorBlock({coordinate: {x: 10*32, y: 4*32}, width: 14*32, height: 8}, 0xD9D9D9);
        var block3 = new StaticColorBlock({coordinate: {x: 4*32, y: 2*32}, width: 8*32, height: 8}, 0xD9D9D9);
        var wallLeft = new StaticColorBlock({coordinate: {x: -17*32, y: 0}, width: 32, height: 9*32}, 0xD9D9D9);
        var wallRight = new StaticColorBlock({coordinate: {x: 32*32, y: 0}, width: 32, height: 9*32}, 0xD9D9D9);
        
        super(app, {drawables: [floor, block1, block2, block3, tenemigs, player], player: player, obstacles: [floor, block1, block2, block3, wallLeft, wallRight], camCoordinate: new Coordinate({x: 0, y: 0})});

        // Inner radius of the circle
        const radius = 3*32;

        // The blur amount
        const blurSize = 32/2;

        const circle = new Graphics()
            .beginFill(0xFF0000)
            .drawCircle(radius + blurSize, radius + blurSize, radius)
            .endFill();
        circle.filters = [new filters.BlurFilter(blurSize)];

        const bounds = new Rectangle(-32, -32, (radius + blurSize + 32) * 2, (radius + blurSize + 32) * 2);
        const texture = app.renderer.generateTexture(circle, {scaleMode: SCALE_MODES.LINEAR, resolution: 2, region: bounds}) as any;
        
        this.#focus = new Sprite(texture);

        app.stage.addChild(this.#focus);
        this._drawables.forEach(drawable => {
            drawable.setMask(this.#focus);
        });
    }

    update(delta: number) {
        this._elapsed += delta;
        this._updateCam(delta);
        this._drawables.forEach(drawable => {
            drawable.update(this, delta);
        });
        this.#updateLights();
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

    #updateLights() {
        this.#focus.x = this._player.coordinate.x + this.player.width/2 - this.#focus.width/2 + this._camCoordinate.x;
        this.#focus.y = this._player.coordinate.y + this.player.height/2 - this.#focus.height/2 + this._camCoordinate.y;
    }
}