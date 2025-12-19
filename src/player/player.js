import GameBoard from "../gameboard/gameboard.js";
import AI from "../ai/ai.js";

export default class Player {
    #type;
    #gameBoard;
    #ai;

    constructor(type = "human", gameBoard = new GameBoard(), movesHistory) {
        if (type === "human" || type === "robot") {
            this.#type = type;
        }
        this.#gameBoard = gameBoard;
        this.#ai = type === "robot" ? new AI() : null;
    }

    get type() {
        return this.#type;
    }

    get gameBoard() {
        return this.#gameBoard;
    }

    makeAIMove(opponentBoard) {
        if (this.#type === "robot" && this.#ai) {
            return this.#ai.makeAttack(opponentBoard);
        }
        return null;
    }
}
