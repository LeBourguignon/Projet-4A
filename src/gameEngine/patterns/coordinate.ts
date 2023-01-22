export type Coord = { x: number, y: number}

export type Rect = { coordinate: Coord, width: number, height: number }

export class Coordinate {
    #x: number;
    #y: number;

    constructor(coordinate: Coord) {
        this.#x = coordinate.x;
        this.#y = coordinate.y;
    }

    set x(value: number) { this.#x = value; }
    get x(): number { return this.#x; }
    
    set y(value: number) { this.#y = value; }
    get y(): number { return this.#y; }
}