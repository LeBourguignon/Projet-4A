export class Coordinate {
    #x;
    #y;

    constructor(coordinate) {
        this.#x = coordinate.x;
        this.#y = coordinate.y;
    }

    set x(value) { this.#x = value; }
    get x() { return this.#x; }
    
    set y(value) { this.#y = value; }
    get y() { return this.#y; }
}