import GameBoard from "./gameboard/gameboard.js";
import Player from "./player/player.js";
import shipTypes from "./shipTypes.js";
import {
    createBoardDisplay,
    renderShips,
    clearShipsDisplay,
} from "./boardDisplay/boardDisplay.js";
import {placeShipsRandomObj, placeOneShip} from "./utils/placeShips.js";
import GameManager from "./gameManager/gameManager.js";

import "./style.css";
import "./boardDisplay/board.css";

function changeCellClasses(attackResult, cell, playerDiv) {
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
}

function changeStatusDisplay(gameManager) {
    //Check if game ended
    if (gameManager.isGameOver()) {
        gameManager.endGame();
        if (gameManager.players[0].gameBoard.allShipsSunk()) {
            status.textContent = "Player 2 won";
        } else {
            status.textContent = "Player 1 won";
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
}

function attachBoardListeners(
    playerDiv,
    playerNumber,
    gameManager,
    otherPlayerDiv = null
) {
    playerDiv.querySelectorAll(".gameboard-div").forEach((cell) => {
        cell.addEventListener("click", () => {
            if (!gameManager.gameStarted && !placeManual) return; // return if game didnt start yet and not placing manual
            if (gameManager.active === playerNumber && !placeManual) return; // prevent player attackin oneself and not placing manual
            
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            
            //if mode is set to place ships
            if (placeManual === true) {
                if (shipsLeft.length > 0) {
                    shipsLeft = placeOneShip(
                        player1GameBoard,
                        shipsLeft,
                        [x, y],
                        shipDirection
                    );
                    clearShipsDisplay(player1Div);
                    renderShips(player1GameBoard, player1Div);
                } 
                if (shipsLeft.length === 0) {
                    placeManual = false;
                    placeRandomBtn.disabled = false;
                    startBtn.disabled = false;
                    changeDirectionBtn.disable = true;
                }
                return;
            }

            let attackResult = gameManager.attack(x, y);

            changeCellClasses(attackResult, cell, playerDiv);

            changeStatusDisplay(gameManager);

            if (gameManager.getCurrentPlayer().type === "robot") {
                const targetBoard = gameManager.getOpponent().gameBoard;
                let attackResult = gameManager.attack();

                let attackedCellCoords, attackedCell;
                // Attack result can be miss, hit, or sunk
                if (attackResult === "miss") {
                    attackedCellCoords = targetBoard.misses.at(-1);
                } else if(attackResult === "hit" || attackResult === "sunk") {
                    attackedCellCoords = targetBoard.hits.at(-1);
                }
                attackedCell = otherPlayerDiv.querySelector(
                    `[data-x="${attackedCellCoords[0]}"][data-y="${attackedCellCoords[1]}"]`
                );

                changeCellClasses(attackResult, attackedCell, otherPlayerDiv);
                changeStatusDisplay(gameManager);
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

placeShipsRandomObj(player1GameBoard);
placeShipsRandomObj(player2GameBoard);

createBoardDisplay(player1GameBoard, player1Div);
createBoardDisplay(player2GameBoard, player2Div);

const gameManager = new GameManager(player1, player2);

attachBoardListeners(player1Div, 0, gameManager, player2Div);
attachBoardListeners(player2Div, 1, gameManager, player1Div);

renderShips(player1GameBoard, player1Div);
renderShips(player2GameBoard, player2Div, true);

const startBtn = document.querySelector("#start-btn");
const placeRandomBtn = document.querySelector("#place-random-btn");
const placeShipsBtn = document.querySelector("#place-ships-btn");
const changeDirectionBtn = document.querySelector("#ship-direction-btn");
const status = document.querySelector("#status");

changeDirectionBtn.disabled = true;

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    placeRandomBtn.disabled = true;
    placeShipsBtn.disabled = true;
    status.textContent = "Player 1 turn";
    gameManager.startGame();
});

placeRandomBtn.addEventListener("click", () => {
    if (!gameManager.gameStarted) {
        gameManager.players[0].gameBoard.clearGameBoard();
        clearShipsDisplay(player1Div);
        placeShipsRandomObj(player1GameBoard);
        renderShips(player1GameBoard, player1Div);
    }
});

let placeManual = false;
let shipsLeft = structuredClone(shipTypes);
let shipDirection = "horizontal";
placeShipsBtn.addEventListener("click", () => {
    shipsLeft = structuredClone(shipTypes);
    placeManual = true;
    changeDirectionBtn.disabled = false;
    placeRandomBtn.disabled = true;
    startBtn.disabled = true;
    gameManager.players[0].gameBoard.clearGameBoard();
    clearShipsDisplay(player1Div);
});

changeDirectionBtn.addEventListener("click",() => {
    if (shipDirection === "horizontal") {
        shipDirection = "vertical";
    } else {
        shipDirection = "horizontal"
    }
})
