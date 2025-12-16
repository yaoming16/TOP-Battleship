import GameBoard from "../gameboard/gameboard.js";

export default class Player {
    #type;
    #gameBoard;

    constructor(type = 'human', gameBoard = new GameBoard()) {
        if (type === 'human' || type === 'robot') {
            this.#type = type;
        }
        this.#gameBoard = gameBoard;
    }

    get type() {
        return this.#type;
    }

    get gameBoard() {
        return this.#gameBoard;
    }
}