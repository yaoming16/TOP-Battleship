import GameBoard from "./gameboard/gameboard.js";
import Ship from "./ship/ship.js";
import Player from "./player/player.js";
import {createBoardDisplay, renderShips} from "./boardDisplay/boardDisplay.js";
import placeShipsObj from "./utils/placeShips.js";
import GameManager from "./gameManager/gameManager.js";

import "./style.css";
import "./boardDisplay/board.css";


function attachBoardListeners(playerDiv, playerNumber, gameManager) {
    playerDiv.querySelectorAll(".gameboard-div").forEach(cell => {
        cell.addEventListener("click", () => {
            if (gameManager.currentPlayer === playerNumber) return // prevent player attackin oneself

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            handleAttack()
        })
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

renderShips(player2GameBoard, player2Div)
renderShips(player1GameBoard, player1Div)

const gameManager = new GameManager(player1, player2);

const startButton = document.querySelector("#start-btn");
const status = document.querySelector("#status");
let currentPlayer = player1;

startButton.addEventListener("click", async () => {
    startButton.disabled = true;
    while (!player1.gameBoard.allShipsSunk() && !player2.gameBoard.allShipsSunk()) {
        if (globals.currentPlayer === 1) {
            switchTurn();
            
        } else {
            switchTurn();
        }
    }
})
