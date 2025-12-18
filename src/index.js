import GameBoard from "./gameboard/gameboard.js";
import Player from "./player/player.js";
import {
    createBoardDisplay,
    renderShips,
} from "./boardDisplay/boardDisplay.js";
import placeShipsObj from "./utils/placeShips.js";
import GameManager from "./gameManager/gameManager.js";

import "./style.css";
import "./boardDisplay/board.css";

function attachBoardListeners(playerDiv, playerNumber, gameManager) {
    playerDiv.querySelectorAll(".gameboard-div").forEach((cell) => {
        cell.addEventListener("click", () => {
            if (gameManager.gameStarted === false) return; // return if game didnt start yet 
            if (gameManager.active === playerNumber) return; // prevent player attackin oneself

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            let attackResult = gameManager.attack(x, y);

            if (attackResult === "hit" || attackResult === "miss") {
                cell.classList.add("attacked-cell");
            } else if (attackResult === "sunk") {
                cell.classList.add("attacked-cell");
                let allSunkShipDivs = playerDiv.querySelectorAll(
                    `[ship-id="${cell.getAttribute("ship-id")}"]`
                );
                allSunkShipDivs.forEach((sunkShipCell) =>
                    sunkShipCell.classList.add("sunk-cell")
                );
            }

            //Check if game ended
            if (gameManager.isGameOver()) {
                gameManager.endGame();
                if (gameManager.players[0].gameBoard.allShipsSunk()) {
                    status.textContent = 'Player 2 won'
                } else {
                    status.textContent = 'Player 1 won'
                }
            } 
            // if didnt ended change status text
            else {
                if (gameManager.active === 0) {
                    status.textContent = "Player 1 turn";
                } else {
                    status.textContent = "Player 2 turn";
                }
            }

        });
    });
}

const player1GameBoard = new GameBoard();
const player2GameBoard = new GameBoard();

const player1 = new Player("human", player1GameBoard);
const player2 = new Player("robot", player2GameBoard);

const boardDiv = document.querySelector("#board-div");

const player1Div = document.querySelector("#player1-div");
const player2Div = document.querySelector("#player2-div");

// Set CSS variables per board (columns = y+1 for labels, rows = x+1)
player1Div.style.setProperty("--length-x", player1GameBoard.x + 1);
player1Div.style.setProperty("--length-y", player1GameBoard.y + 1);

player2Div.style.setProperty("--length-x", player2GameBoard.x + 1);
player2Div.style.setProperty("--length-y", player2GameBoard.y + 1);

placeShipsObj(player2GameBoard, "random");
placeShipsObj(player1GameBoard, "random");

createBoardDisplay(player1GameBoard, player1Div);
createBoardDisplay(player2GameBoard, player2Div);

const gameManager = new GameManager(player1, player2);

attachBoardListeners(player1Div, 0, gameManager);
attachBoardListeners(player2Div, 1, gameManager);

renderShips(player2GameBoard, player2Div, true);
renderShips(player1GameBoard, player1Div);

const startButton = document.querySelector("#start-btn");
const status = document.querySelector("#status");

startButton.addEventListener("click", () => {
    startButton.disabled = true;
    status.textContent = "Player 1 turn";
    gameManager.startGame();
});
