import { Application, filters, Graphics, ICanvas, Rectangle, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { Coordinate } from "./coordinate";
import { HitBox, Rect} from "./hitBox";
import { Player } from "./hitBox/player";

export const BlurSize = 32*2;

export type Keys = { 
    upPressed: boolean, 
    downPressed: boolean, 
    rightPressed: boolean, 
    leftPressed: boolean,
    interactionPressed: boolean}

export type Map = { 
    size: Rect, 
    drawables: HitBox[], 
    obstacles: HitBox[], 
    player: Player, 
    camCoordinate: Coordinate, 
    inTheDarkness: boolean }

export class Level {
    _app: Application<ICanvas>;
    _keys: Keys;

    _size: Rect;
    _drawables: HitBox[];
    _obstacles: HitBox[];
    _player: Player;

    _camCoordinate: Coordinate;
    _elapsed = 0.0;

    _inTheDarkness: boolean;
    _lighting: Graphics | null = null;
    _focus: Sprite | null = null;

    constructor(app: Application<ICanvas>, map: Map) {
        this._app = app;
        this._keys = { upPressed: false, downPressed: false, rightPressed: false, leftPressed: false, interactionPressed: false};

        this._size = map.size;
        this._drawables = map.drawables;
        this._player = map.player;
        this._obstacles = map.obstacles;
        this._camCoordinate = map.camCoordinate;

        var top = new HitBox({coordinate: {x: this._size.coordinate.x, y: this._size.coordinate.y - 32}, width: this._size.width, height: 32});
        this._obstacles.push(top);
        var bot = new HitBox({coordinate: {x: this._size.coordinate.x, y: this._size.coordinate.y + this._size.height}, width: this._size.width, height: 32});
        this._obstacles.push(bot);
        var left = new HitBox({coordinate: {x: this._size.coordinate.x - 32, y: this._size.coordinate.y}, width: 32, height: this._size.height});
        this._obstacles.push(left);
        var right = new HitBox({coordinate: {x: this._size.coordinate.x + this._size.width, y: this._size.coordinate.y}, width: 32, height: this._size.height});
        this._obstacles.push(right);

        this._drawables.forEach(drawable => {
            drawable.addToStage(this);
        });

        this._inTheDarkness = map.inTheDarkness;

        if(this._inTheDarkness) {
           this._updateLights();
        }
    }

    get app(): Application<ICanvas> { return this._app; }

    set keys(value: Keys) { this._keys = value; }
    get keys(): Keys { return this._keys; }

    get size(): Rect { return this._size; }

    get drawables(): HitBox[] { return this._drawables; }

    get player(): Player { return this._player; }
    
    get obstacles(): HitBox[] { return this._obstacles; }

    set camCoordinate(value: Coordinate) { this._camCoordinate = value; }
    get camCoordinate(): Coordinate { return this._camCoordinate; }

    update(delta: number) {
        this._elapsed += delta;
        this._updateCam(delta);
        this._drawables.forEach(drawable => {
            drawable.update(this, delta);
        });
        
        if(this._inTheDarkness)
            this._updateLights();
        
    
    }

    _updateCam(delta: number) {
        throw "Redefine the updateCam method!"
    }

    _updateLights() {
        this._lighting?.destroy({children: true});
        this._lighting = new Graphics();
        this._drawables.forEach(drawable => {
            drawable.addLighting(this, this._lighting);
        });
        this._lighting.filters = [new filters.BlurFilter(BlurSize)];

        const bounds = new Rectangle(this._size.coordinate.x, this._size.coordinate.y, this._size.width, this._size.height);
   
        this._focus?.destroy({children: true, texture: true, baseTexture: true});
        const texture = this._app.renderer.generateTexture(this._lighting, {region: bounds}) as any;
        
        this._focus = new Sprite(texture);
        
        this._drawables.forEach(drawable => {
            drawable.setMask(this._focus);
        });
        
    }
}