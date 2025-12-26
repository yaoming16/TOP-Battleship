export default function changeStatusDisplay(gameManager) {
    const statusDiv = document.querySelector("#status");
    
    //Check if game ended
    if (gameManager.isGameOver()) {
        gameManager.endGame();
        if (gameManager.players[0].gameBoard.allShipsSunk()) {
            statusDiv.textContent = "Player 2 won";
        } else {
            statusDiv.textContent = "Player 1 won";
        }
    }

    // If already started show current player. Else ask player to click start button to play
    if (gameManager.gameStarted) {
        if (gameManager.active === 0) {
            statusDiv.textContent = "Player 1 turn";
        } else {
            statusDiv.textContent = "Player 2 turn";
        }
    } else {
        statusDiv.textContent = "Click Start to play";
    }

    // if we are adding ships
    if (gameManager.placeManual) {
        statusDiv.textContent = `Place a ${gameManager.shipsLeft[0].name} (Length: ${gameManager.shipsLeft[0].length}) (Direction: ${gameManager.shipDirection})`;
    }
}
