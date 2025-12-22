import shipTypes from "../shipTypes.js";
import Ship from "../ship/ship.js";

export function placeShipsRandomObj(gameBoardObj) {
    const directions = ["vertical", "horizontal"];

    for (let shipType of shipTypes) {
        let shipTypeAmount = shipType.number;
        let coordX;
        let coordY;
        let direction;
        let newShip = new Ship(shipType.length);

        do {
            coordX = Math.floor(Math.random() * (gameBoardObj.x - 1 + 1)) + 1;
            coordY = Math.floor(Math.random() * (gameBoardObj.y - 1 + 1)) + 1;
            direction = Math.round(Math.random());
            if (
                gameBoardObj.placeShip(
                    newShip,
                    coordX,
                    coordY,
                    directions[direction]
                ) === true
            ) {
                shipTypeAmount--;
                newShip = new Ship(shipType.length);
            }
        } while (shipTypeAmount !== 0);
    }
}

export function placeOneShip(gameBoardObj, shipsLeft, coords, shipDirection) {
    let nextShip = shipsLeft[0];
    let newShip = new Ship(nextShip.length);

    if (
        gameBoardObj.placeShip(newShip, coords[0], coords[1], shipDirection) ===
        true
    ) {
        shipsLeft[0].number--;
    }

    if (nextShip.number === 0) {
        shipsLeft.splice(0, 1);
    }

    return shipsLeft;
}
