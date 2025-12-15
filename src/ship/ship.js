const { v4: uuidv4 } = require("uuid");

export default class Ship {
    #length;
    #hits;
    #id;

    constructor(length, hits = 0) {
        this.#length = length;
        this.#hits = hits;
        this.#id = uuidv4();
    }

    get length() {
        return this.#length;
    }

    get hits() {
        return this.#hits;
    }

    get id() {
        return this.#id;
    }

    hit() {
        this.#hits++;
    }

    isSunk() {
        return this.#hits >= this.#length;
    }
}
