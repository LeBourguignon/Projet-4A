import { AnimatedSprite, Graphics, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { assets } from "../../..";
import { DevTenemigsDialogBox } from "../../dialogBox/devTenemigsDialogBox";
import { Coord } from "../../patterns/coordinate";
import { HitBox } from "../../patterns/hitBox";
import { Level } from "../../patterns/level";

export const tenemigsWidth = 10;
export const tenemigsHeight = 16;

export const tenemigsSpriteTime = 25;

export class DevTenemigs extends HitBox {

    #showHitBox: boolean;

    #hitBox: Graphics;
    #animatedSprite: AnimatedSprite;
    #interactiveSprite: AnimatedSprite;

    #animatedSpriteTime: number = tenemigsSpriteTime;
    #animatedSpriteFrame: number = 0;
    #facingRight: boolean = true;

    #interactiveSpriteTime: number = 20;
    #interactiveSpriteFrame: number = 0;

    #dialogBox: DevTenemigsDialogBox | null = null;

    constructor(coordinate: Coord, texts: string[] = [], showHitBox: boolean = false) {
        super({coordinate: coordinate, width: tenemigsWidth, height: tenemigsHeight});

        this.#showHitBox = showHitBox;
        if(this.#showHitBox) {
            this.#hitBox = new Graphics();
            this.#hitBox.beginFill(0x0000FF)
                        .drawRect(0, 0, this._width, this._height)
                        .endFill();
        }

        if(texts.length)
            this.#dialogBox = new DevTenemigsDialogBox(texts);

        const animatedTextures = [
            assets.tenemigs.tenemigsIdle00, // 0
            assets.tenemigs.tenemigsIdle01, // 1
            assets.tenemigs.tenemigsIdle02, // 2
            assets.tenemigs.tenemigsIdle03, // 3
            assets.tenemigs.tenemigsIdle04, // 4
            assets.tenemigs.tenemigsIdle05, // 5

            assets.tenemigs.tenemigsRun00,  // 6
            assets.tenemigs.tenemigsRun01,  // 7
            assets.tenemigs.tenemigsRun02,  // 8
            assets.tenemigs.tenemigsRun03,  // 9
            assets.tenemigs.tenemigsRun04,  // 10
            assets.tenemigs.tenemigsRun05   // 11
        ];

        animatedTextures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });

        this.#animatedSprite = new AnimatedSprite(animatedTextures);
        this.#animatedSprite.anchor.x = 0.5;

        const interactiveTextures = [
            assets.keys.keyE00, // 0
            assets.keys.keyE01  // 1
        ];

        interactiveTextures.forEach(texture => {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        });

        this.#interactiveSprite = new AnimatedSprite(interactiveTextures);
        this.#interactiveSprite.anchor.y = 1;
        this.#interactiveSprite.visible = false;
    }

    addToStage(level: Level) {
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
            level.game.app.stage.addChild(this.#hitBox);
        }

        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + this._width/2;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y;
        level.game.app.stage.addChild(this.#animatedSprite);

        this.#interactiveSprite.x = this._coordinate.x + level.camCoordinate.x + this._width/2 - 6.5;
        this.#interactiveSprite.y = this._coordinate.y + level.camCoordinate.y - 20;
        level.game.app.stage.addChild(this.#interactiveSprite);
    }

    setMask(mask: Sprite) {
        if(this.#showHitBox)
            this.#hitBox.mask = mask;
        this.#animatedSprite.mask = mask;
    }
    
    update(level: Level, delta: number) {
        this.#updateCoordinates(level, delta);
        this.#updateAnimation(level, delta);
        this.#updateInteraction(level, delta);
    }

    #updateCoordinates(level: Level, delta: number) {
        if(this.#showHitBox) {
            this.#hitBox.x = this._coordinate.x + level.camCoordinate.x;
            this.#hitBox.y = this._coordinate.y + level.camCoordinate.y;
        }
        
        this.#animatedSprite.x = this._coordinate.x + level.camCoordinate.x + this._width/2;
        this.#animatedSprite.y = this._coordinate.y + level.camCoordinate.y;
    }

    #updateAnimation(level: Level, delta: number) {
        // Animated
        if(this.#animatedSpriteFrame > 5) {    // Neutral
            this.#animatedSpriteTime = tenemigsSpriteTime;
            this.#animatedSpriteFrame = 0;
            this.#animatedSprite.currentFrame = this.#animatedSpriteFrame;
        }
        else {
            this.#animatedSpriteTime -= delta;
            
            if(this.#animatedSpriteTime < 0) {
                this.#animatedSpriteTime = tenemigsSpriteTime;
                this.#animatedSpriteFrame = (this.#animatedSpriteFrame + 1) % 6;
                this.#animatedSprite.currentFrame = this.#animatedSpriteFrame;
            }
        }

        // Orientation
        if(level.player.coordinate.x > this._coordinate.x + this._width && !this.#facingRight) {
            this.#facingRight = true;
            this.#animatedSprite.scale.x *= -1;
        }
        if(level.player.coordinate.x + level.player.width < this._coordinate.x && this.#facingRight) {
            this.#facingRight = false;
            this.#animatedSprite.scale.x *= -1;
        }

        // Interactive
        if(this.isOverlaid(level.player) && !this.#dialogBox.isStarted) {
            this.#interactiveSprite.visible = true;
            this.#interactiveSpriteTime -= delta;

            if(this.#interactiveSpriteTime < 0) {
                this.#interactiveSpriteTime = 20;
                this.#interactiveSpriteFrame = (this.#interactiveSpriteFrame + 1) % 2;
                this.#interactiveSprite.currentFrame = this.#interactiveSpriteFrame;
            }
        }
        else {
            this.#interactiveSprite.visible = false;
            this.#interactiveSpriteTime = 0;
            this.#interactiveSpriteFrame = 1;
        }
    }

    #updateInteraction(level: Level, delta: number) {
        if(this.isOverlaid(level.player) && level.game.keys.interaction.pressed && level.game.keys.interaction.clicked && this.#dialogBox && !this.#dialogBox.isStarted)
            this.#dialogBox.start(level);
        if(this.#dialogBox && this.#dialogBox.isStarted)
            this.#dialogBox.update(level, delta);
    }
}