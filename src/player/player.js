import GameBoard from "../gameboard/gameboard.js";

export default class Player {
    #type;
    #gameBoard;

    constructor(type = "human", gameBoard = new GameBoard(), movesHistory) {
        if (type === "human" || type === "robot") {
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

    makeAIMove(opponentBoard) {
        if (this.#type === "robot") {
            return this.#makeRandomAttack(opponentBoard);
        }
        return null;
    }

    #makeRandomAttack(board) {
        let x, y, result;
        do {
            x = Math.floor(Math.random() * board.x) + 1;
            y = Math.floor(Math.random() * board.y) + 1;
            result = board.receiveAttack(x, y);
        } while (result === "already attacked");
        return result;
    }
}
