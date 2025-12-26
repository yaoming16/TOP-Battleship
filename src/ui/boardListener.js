import { changeCellClasses, toggleCellMarked } from "./cellStyle.js";
import { placeOneShip } from "../utils/placeShips.js";
import { renderShips, clearShipsDisplay } from "../boardDisplay/boardDisplay.js";
import changeStatusDisplay from "./statusDisplay.js";

export default function attachBoardListeners(
    playerDiv,
    playerNumber,
    gameManager,
    otherPlayerDiv = null,
    gameBoard = null
) {
    playerDiv.querySelectorAll(".gameboard-div").forEach((cell) => {
        // Mobile long-press support for marking
        let longPressTimer;
        cell.addEventListener("touchstart", (event) => {
            longPressTimer = setTimeout(() => {
                if (!gameManager.gameStarted && !gameManager.placeManual) return;
                if (gameManager.active === playerNumber && !gameManager.placeManual) return;
                
                event.preventDefault();
                toggleCellMarked(cell);
                // Haptic feedback if available
                if (navigator.vibrate) navigator.vibrate(50);
            }, 500); // 500ms long-press
        });

        cell.addEventListener("touchend", () => {
            clearTimeout(longPressTimer);
        });

        cell.addEventListener("touchmove", () => {
            clearTimeout(longPressTimer);
        });

        //Event so player can mark cell with right-click
        cell.addEventListener("contextmenu", (event) => {
            if (!gameManager.gameStarted && !gameManager.placeManual) return; // return if game didnt start yet and not placing manual
            if (gameManager.active === playerNumber && !gameManager.placeManual)
                return; // prevent player attackin oneself and not placing manual

            event.preventDefault();
            toggleCellMarked(cell);
        });

        // Keyboard support: M to mark, Enter/Space to click, Arrows to navigate
        cell.addEventListener("keydown", (event) => {
            if (event.code === "KeyM") {
                // Mark cell with M key
                event.preventDefault();
                if (!gameManager.gameStarted && !gameManager.placeManual) return;
                if (gameManager.active === playerNumber && !gameManager.placeManual) return;
                toggleCellMarked(cell);
            } else if (event.code === "Enter" || event.code === "Space") {
                // Click cell with Enter or Space
                event.preventDefault();
                cell.click();
            } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
                // Navigate between cells with arrow keys
                event.preventDefault();
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                let nextX = x;
                let nextY = y;

                if (event.code === "ArrowUp") nextY--;
                else if (event.code === "ArrowDown") nextY++;
                else if (event.code === "ArrowLeft") nextX--;
                else if (event.code === "ArrowRight") nextX++;

                const nextCell = playerDiv.querySelector(
                    `[data-x="${nextX}"][data-y="${nextY}"]`
                );
                if (nextCell) nextCell.focus();
            }
        });

        //Add event to play the game/change visual styles
        cell.addEventListener("click", () => {
            if (!gameManager.gameStarted && !gameManager.placeManual) return; // return if game didnt start yet and not placing manual
            if (gameManager.active === playerNumber && !gameManager.placeManual)
                return; // prevent player attackin oneself and not placing manual

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            //if mode is set to place ships
            if (gameManager.placeManual === true) {
                if (gameManager.shipsLeft.length > 0) {
                    placeOneShip(
                        gameBoard,
                        gameManager.shipsLeft,
                        [x, y],
                        gameManager.shipDirection
                    );
                    clearShipsDisplay(playerDiv);
                    renderShips(gameBoard, playerDiv);
                }
                if (gameManager.shipsLeft.length === 0) {
                    gameManager.placeManual = false;
                    
                    const placeRandomBtn = document.querySelector("#place-random-btn");
                    const startBtn = document.querySelector("#start-btn");
                    const changeDirectionBtn = document.querySelector("#ship-direction-btn");
                    const placeShipsBtn = document.querySelector("#place-ships-btn");
                    
                    placeRandomBtn.disabled = false;
                    placeRandomBtn.setAttribute("aria-disabled", "false");
                    placeRandomBtn.setAttribute("aria-label", "Randomly place all ships on your board");
                    
                    startBtn.disabled = false;
                    startBtn.setAttribute("aria-disabled", "false");
                    startBtn.setAttribute("aria-label", "Start the game - all ships placed");
                    
                    changeDirectionBtn.disabled = true;
                    changeDirectionBtn.setAttribute("aria-disabled", "true");
                    
                    placeShipsBtn.setAttribute("aria-label", "All ships placed");
                }
                changeStatusDisplay(gameManager);
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
                } else if (attackResult === "hit" || attackResult === "sunk") {
                    attackedCellCoords = targetBoard.hits.at(-1);
                }
                // Guard against undefined coords in edge cases
                if (!attackedCellCoords) {
                    changeStatusDisplay(gameManager);
                    return;
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