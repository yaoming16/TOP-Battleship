import shipTypes from "../shipTypes.js";
import Ship from "../ship/ship.js";

function placeShipsObj(gameBoardObj, mode) {
    const directions = ["vertical", "horizontal"];
    if (mode === "random") {
        for (let shipType of shipTypes) {
            let shipTypeAmount = shipType.number;
            let coordX;
            let coordY;
            let direction;
            let newShip = new Ship(shipType.length);

            do {
                coordX =
                    Math.floor(Math.random() * (gameBoardObj.x - 1 + 1)) + 1;
                coordY =
                    Math.floor(Math.random() * (gameBoardObj.y - 1 + 1)) + 1;
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
}

export default placeShipsObj;
