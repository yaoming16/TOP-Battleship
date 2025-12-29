import GameBoard from "./gameboard/gameboard.js";
import Player from "./player/player.js";
import {
    createBoardDisplay,
    renderShips,
    clearShipsDisplay,
} from "./boardDisplay/boardDisplay.js";
import { placeShipsRandomObj } from "./utils/placeShips.js";
import GameManager from "./gameManager/gameManager.js";
import changeStatusDisplay from "./ui/statusDisplay.js";
import attachBoardListeners from "./ui/boardListener.js";

import "./style.css";
import "./boardDisplay/board.css";

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

attachBoardListeners(player1Div, 0, gameManager, player2Div, player1GameBoard);
attachBoardListeners(player2Div, 1, gameManager, player1Div, player2GameBoard);

renderShips(player1GameBoard, player1Div);
renderShips(player2GameBoard, player2Div, true);

const startBtn = document.querySelector("#start-btn");
const placeRandomBtn = document.querySelector("#place-random-btn");
const placeShipsBtn = document.querySelector("#place-ships-btn");
const changeDirectionBtn = document.querySelector("#ship-direction-btn");
const status = document.querySelector("#status");
const restartBtn = document.querySelector("#restart-game-btn");

// Initialize button labels
startBtn.setAttribute("aria-label", "Start the game");
placeRandomBtn.setAttribute(
    "aria-label",
    "Randomly place all ships on your board"
);
placeShipsBtn.setAttribute("aria-label", "Manually place ships on your board");

changeDirectionBtn.disabled = true;
changeDirectionBtn.setAttribute("aria-disabled", "true");

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.setAttribute("aria-disabled", "true");
    startBtn.setAttribute("aria-label", "Game started");

    placeRandomBtn.disabled = true;
    placeRandomBtn.setAttribute("aria-disabled", "true");
    placeRandomBtn.setAttribute(
        "aria-label",
        "Cannot change ship placement - game in progress"
    );

    placeShipsBtn.disabled = true;
    placeShipsBtn.setAttribute("aria-disabled", "true");
    placeShipsBtn.setAttribute(
        "aria-label",
        "Cannot change ship placement - game in progress"
    );

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

placeShipsBtn.addEventListener("click", () => {
    gameManager.resetShips();
    gameManager.placeManual = true;

    changeDirectionBtn.disabled = false;
    changeDirectionBtn.setAttribute("aria-disabled", "false");

    placeRandomBtn.disabled = true;
    placeRandomBtn.setAttribute("aria-disabled", "true");
    placeRandomBtn.setAttribute(
        "aria-label",
        "Cannot use random placement - manual mode active"
    );

    restartBtn.disabled = true;
    restartBtn.setAttribute("aria-disabled", "true");
    restartBtn.setAttribute(
        "aria-label",
        "Cannot restart - finish placing ships first"
    );

    startBtn.disabled = true;
    startBtn.setAttribute("aria-disabled", "true");
    startBtn.setAttribute("aria-label", "Finish placing ships before starting");

    placeShipsBtn.setAttribute("aria-label", "Manual placement mode active");

    gameManager.players[0].gameBoard.clearGameBoard();
    clearShipsDisplay(player1Div);
    changeStatusDisplay(gameManager);
});

changeDirectionBtn.addEventListener("click", () => {
    if (gameManager.shipDirection === "horizontal") {
        gameManager.shipDirection = "vertical";
        changeDirectionBtn.setAttribute(
            "aria-label",
            "Change ship direction (currently vertical)"
        );
    } else {
        gameManager.shipDirection = "horizontal";
        changeDirectionBtn.setAttribute(
            "aria-label",
            "Change ship direction (currently horizontal)"
        );
    }
    changeStatusDisplay(gameManager);
});

restartBtn.addEventListener("click", () => {
    gameManager.resetGame();
    clearShipsDisplay(player1Div);
    clearShipsDisplay(player2Div);

    // Refresh ships with new placement
    placeShipsRandomObj(player1GameBoard);
    placeShipsRandomObj(player2GameBoard);
    renderShips(player1GameBoard, player1Div);
    renderShips(player2GameBoard, player2Div, true);

    startBtn.disabled = false;
    startBtn.setAttribute("aria-disabled", "false");
    placeRandomBtn.disabled = false;
    placeRandomBtn.setAttribute("aria-disabled", "false");
    placeShipsBtn.disabled = false;
    placeShipsBtn.setAttribute("aria-disabled", "false");
    changeDirectionBtn.disabled = true;
    changeDirectionBtn.setAttribute("aria-disabled", "true");

    changeStatusDisplay(gameManager);
});

changeStatusDisplay(gameManager);
