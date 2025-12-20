export default class AI {
    #lastAttackStatus;
    #continueAttackingSameShip;

    constructor() {
        this.#lastAttackStatus = "";
        this.#continueAttackingSameShip = false;
    }

    makeAttack(board) {
        // If it is the first attack, last attack was a miss or ships was sunk we want to make a random attack
        if (
            this.#lastAttackStatus !== "hit" &&
            !this.#continueAttackingSameShip
        )
            return this.#makeRandomAttack(board);
        else {
            return this.#attackWithPreviousAttack(board, -1);
        }
    }

    #makeRandomAttack(board) {
        let x, y, result;
        do {
            x = Math.floor(Math.random() * board.x) + 1;
            y = Math.floor(Math.random() * board.y) + 1;
            result = board.receiveAttack(x, y);
        } while (result === "already attacked");
        this.#lastAttackStatus = result;
        if (result === "hit") {
            this.#continueAttackingSameShip = true;
        }
        return result;
    }

    #attackWithPreviousAttack(board, index) {
        const lastHit = board.hits.at(index);
        // If there is no previous hit to pivot from, fall back to random attack
        if (!lastHit) return this.#makeRandomAttack(board);

        let [lastX, lastY] = lastHit;
        let randIndex, result, x, y;
        let possibleCoords = [
            [lastX, lastY - 1],
            [lastX, lastY + 1],
            [lastX - 1, lastY],
            [lastX + 1, lastY],
        ];
        do {
            randIndex = Math.floor(Math.random() * possibleCoords.length);
            [x, y] = possibleCoords[randIndex];
            possibleCoords.splice(randIndex, 1);
            result = board.receiveAttack(x, y);
        } while (
            (result === "already attacked" || result === "out of bounds") &&
            possibleCoords.length !== 0
        );
        if (possibleCoords.length === 0) {
            return this.#attackWithPreviousAttack(board, index - 1);
        }
        this.#lastAttackStatus = result;
        if (result === "sunk") {
            this.#continueAttackingSameShip = false;
        }
        return result;
    }
}
