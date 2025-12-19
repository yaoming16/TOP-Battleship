export default class GameManager {
    #players;
    #active;
    #gameStarted;

    constructor(player1, player2) {
        this.#players = [player1, player2];
        this.#active = 0;
        this.#gameStarted = false;
    }

    get gameStarted() {
        return this.#gameStarted;
    }

    get active() {
        return this.#active;
    }

    get players() {
        return this.#players;
    }

    startGame() {
        this.#gameStarted = true;
    }

    endGame() {
         this.#gameStarted = false;
    }

    getCurrentPlayer() {
        return this.#players[this.#active];
    }

    getOpponent() {
        return this.#active === 0? this.#players[1] : this.#players[0]; 
    }

    attack(x = 0, y = 0) {
        let result;
        if (this.getCurrentPlayer().type === 'robot' ) {   
            result = this.getCurrentPlayer().makeAIMove(this.getOpponent().gameBoard);
            this.switchTurnIfNeeded(result);
        } else {
            result = this.getOpponent().gameBoard.receiveAttack(x, y);
            if (result !== "already attacked") {
                this.switchTurnIfNeeded(result);
            }         
            
        }
        return result;
    }

    switchTurnIfNeeded(result) {
        this.#active = this.#active === 0? 1 : 0;
    }

    isGameOver() {
        return this.#players[0].gameBoard.allShipsSunk() || this.#players[1].gameBoard.allShipsSunk();
    }

}