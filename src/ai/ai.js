export default class AI {
    #hitsToShip;

    constructor() {
        this.#hitsToShip = 0;
    }

    makeAttack(board) {
        // Random only while we have no ongoing hit streak
        if (this.#hitsToShip === 0) {
            return this.#makeRandomAttack(board);
        }
        if (this.#hitsToShip === 1) {
            return this.#attackWithPreviousAttack(board, -1);
        }
        if (this.#hitsToShip > 1) {
            return this.#attackInOneLine(board);
        }
        return this.#makeRandomAttack(board);
    }

    #makeRandomAttack(board) {
        let x, y, result;
        do {
            x = Math.floor(Math.random() * board.x) + 1;
            y = Math.floor(Math.random() * board.y) + 1;
            result = board.receiveAttack(x, y);
        } while (result === "already attacked");
        if (result === "hit") {
            this.#hitsToShip++;
        }
        return result;
    }

    #attackWithPreviousAttack(board, index) {
        const lastHit = board.hits.at(index);
        // If there is no previous hit to pivot from, fall back to random attack
        if (!lastHit){
            this.#hitsToShip === 0;
            return this.#makeRandomAttack(board);       
        } 

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
        if (result === "sunk") {
            this.#hitsToShip = 0;
        }
        if (result === "hit") {
            this.#hitsToShip++;
        }

        if (possibleCoords.length === 0) {
            return this.#attackWithPreviousAttack(board, index - 1);
        }

        return result;
    }

    // Continue attacking along the inferred line from the last two hits
    #attackInOneLine(board) {
        const lastHit1 = board.hits.at(-1);
        const lastHit2 = board.hits.at(-this.#hitsToShip);
        // Fallback if we don't have two hits to infer direction
        if (!lastHit1 || !lastHit2) {
            this.#hitsToShip === 0;
            return this.#makeRandomAttack(board);
        }

        const dx = Math.sign(lastHit1[0] - lastHit2[0]);
        const dy = Math.sign(lastHit1[1] - lastHit2[1]);
        console.log(lastHit1, lastHit2)
        console.log("dx", dx, "dy", dy)

        // Try extending forward from the most recent hit
        let x = lastHit1[0] + dx;
        let y = lastHit1[1] + dy;
        let result = board.receiveAttack(x, y);

        // If invalid or already attacked, try the opposite end
        if (result === "already attacked" || result === "out of bounds") {
            x = lastHit2[0] - dx;
            y = lastHit2[1] - dy;
            result = board.receiveAttack(x, y);
        }

        // If still invalid, fall back to random to guarantee progress
        if (result === "already attacked" || result === "out of bounds") {
            result = this.#makeRandomAttack(board);
            this.#hitsToShip === 0;
        }

        // Track streak and resets
        if (result === "sunk") {
            this.#hitsToShip = 0;
        } else if (result === "hit") {
            this.#hitsToShip++;
        }
        return result;
    }
}
