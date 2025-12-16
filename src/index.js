import GameBoard from "./gameboard/gameboard.js";
import Ship from "./ship/ship.js";
import Player from "./player/player.js";
import createBoardDisplay from "./boardDisplay/boardDisplay.js";
import placeShipsObj from "./boardDisplay/placeShips.js";

import "./style.css";

const player1GameBoard = new GameBoard();
const player2GameBoard = new GameBoard();

const player1 = new Player("human", player1GameBoard);
const player2 = new Player("robot", player2GameBoard);

const boardDiv = document.querySelector("#board-div");

const player1Div = document.querySelector("#player1-div");
const player2Div = document.querySelector("#player2-div");

boardDiv.style.setProperty("--length-x", player1GameBoard.x + 1);
boardDiv.style.setProperty("--length-y", player1GameBoard.y + 1);

placeShipsObj(player2GameBoard, "random");
console.log(player2GameBoard);

createBoardDisplay(player1GameBoard, player1Div);
createBoardDisplay(player2GameBoard, player2Div);


