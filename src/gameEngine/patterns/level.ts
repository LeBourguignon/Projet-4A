import { Application, filters, Graphics, ICanvas, Rectangle, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { Coordinate, Rect } from "./coordinate";
import { HitBox} from "./hitBox";
import { Player } from "../hitBox/player";
import { Game } from "./game";
import { Sound } from "@pixi/sound";

export const BlurSize = 32*2;

export type Map = { 
    size?: Rect, 
    drawables: HitBox[], 
    obstacles: HitBox[], 
    player: Player, 
    camCoordinate: Coordinate, 
    inTheDarkness?: boolean,
    theme?: Sound
}

export class Level {
    _id: number;

    _game: Game | null = null;

    _size: Rect;
    _drawables: HitBox[];
    _obstacles: HitBox[];
    _player: Player;

    _ongoingDialog: boolean;

    _camCoordinate: Coordinate;
    _elapsed = 0.0;

    _inTheDarkness: boolean = false;
    _lighting: Graphics | null = null;
    _focus: Sprite | null = null;

    _theme: Sound | null = null;

    constructor(map: Map, id: number = 0) {
        this._id = id;

        this._drawables = map.drawables;
        this._player = map.player;
        this._obstacles = map.obstacles;
        this._camCoordinate = map.camCoordinate;

        if(map.size) {
            this._size = map.size;
            this._obstacles.push(new HitBox({coordinate: {x: this._size.coordinate.x, y: this._size.coordinate.y - 32}, width: this._size.width, height: 32}));
            this._obstacles.push(new HitBox({coordinate: {x: this._size.coordinate.x, y: this._size.coordinate.y + this._size.height}, width: this._size.width, height: 32}));
            this._obstacles.push(new HitBox({coordinate: {x: this._size.coordinate.x - 32, y: this._size.coordinate.y}, width: 32, height: this._size.height}));
            this._obstacles.push(new HitBox({coordinate: {x: this._size.coordinate.x + this._size.width, y: this._size.coordinate.y}, width: 32, height: this._size.height}));
        }

        if(map.inTheDarkness) this._inTheDarkness = map.inTheDarkness;
        if(map.theme) this._theme = map.theme;
    }

    get id(): number { return this._id; }

    get game(): Game { return this._game; }

    get size(): Rect { return this._size; }

    get drawables(): HitBox[] { return this._drawables; }

    set player(value: Player) { this._player = value; }
    get player(): Player { return this._player; }
    
    get obstacles(): HitBox[] { return this._obstacles; }

    set ongoingDialog(value: boolean) { this._ongoingDialog = value; }
    get ongoingDialog(): boolean { return this._ongoingDialog; }

    set camCoordinate(value: Coordinate) { this._camCoordinate = value; }
    get camCoordinate(): Coordinate { return this._camCoordinate; }

    addToStage(game: Game) {
        this._game = game;

        this._drawables.forEach(drawable => {
            drawable.addToStage(this);
        });

        if(this._inTheDarkness) this._updateLights();
        if(this._theme) this._theme.play();
    }

    update(delta: number = 0) {
        if(this._game !== null) {
            this._elapsed += delta;
            this._updateCam(delta);
            this._drawables.forEach(drawable => {
                drawable.update(this, delta);
            });
            
            if(this._inTheDarkness)
                this._updateLights();
        }
    }

    removeToStage() {
        while(this._game.app.stage.children[0])
            this._game.app.stage.removeChild(this._game.app.stage.children[0])
        if(this._theme) this._theme.stop();
        this._game = null;
    }

    _updateCam(delta: number = 0) {
        throw "Redefine the updateCam method!"
    }

    _updateLights(delta: number = 0) {
        this._lighting?.destroy({children: true});
        this._lighting = new Graphics();
        this._drawables.forEach(drawable => {
            drawable.addLighting(this, this._lighting);
        });
        this._lighting.filters = [new filters.BlurFilter(BlurSize)];

        const bounds = new Rectangle(this._size.coordinate.x, this._size.coordinate.y, this._size.width, this._size.height);
   
        this._focus?.destroy({children: true, texture: true, baseTexture: true});
        const texture = this._game.app.renderer.generateTexture(this._lighting, {region: bounds}) as any;
        
        this._focus = new Sprite(texture);
        
        this._drawables.forEach(drawable => {
            drawable.setMask(this._focus);
        });
        
    }
}