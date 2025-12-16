import Ship from "../ship/ship.js";

export default class GameBoard {
    #x;
    #y;
    #ships;
    #misses;
    #hits;

    constructor(x = 10, y = 10) {
        this.#x = x;
        this.#y = y;
        this.#hits = [];
        this.#misses = [];
        this.#ships = [];
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get ships() {
        return this.#ships;
    }

    get misses() {
        return this.#misses;
    }

    get hits() {
        return this.#hits;
    }

    #areCoordsInsideTheBoard(coordX, coordY) {
        if (coordX > this.#x || coordY > this.#y || coordX < 1 || coordY < 1)
            return false;
        else return true;
    }

    #checkIfVectorAlreadyInArray(arr, coordX, coordY) {
        return arr.some((coord) => coord[0] === coordX && coord[1] === coordY);
    }

    #coordHasAShip(coordX, coordY) {
        for (let shipInfo of this.#ships) {
            if (
                this.#checkIfVectorAlreadyInArray(
                    shipInfo.allCoords,
                    coordX,
                    coordY
                )
            )
                return shipInfo;
        }
        return null;
    }

    #coordAIsNextToCoordB(coordA, coordB) {
        const AX = coordA[0];
        const AY = coordA[1];
        coordsToCheck = [[],[],[],[],[],[],[],[],[]]
    }

    placeShip(ship, coordX, coordY, direction) {
        // If direction is invalid return
        if (direction !== "horizontal" && direction !== "vertical")
            return false;

        // If ship overflows the board return
        if (direction === "horizontal" && coordX + ship.length - 1 > this.#x)
            return false;
        if (direction === "vertical" && coordY + ship.length - 1 > this.#y)
            return false;

        // If coordX or coordY outside the board return
        if (!this.#areCoordsInsideTheBoard(coordX, coordY)) return false;

        // Calculate all ships coords and buffer
        let allShipCoords = [];
        for (let i = 0; i < ship.length; i++) {
            if (direction === "horizontal") {
                allShipCoords.push([coordX + i, coordY]);
            } else {
                allShipCoords.push([coordX, coordY + i]);
            }
        }

        // Dont place if ships overlap
        for (let coord of allShipCoords) {
            if (this.#coordHasAShip(coord[0], coord[1]) !== null) {
                return false;
            }
        }

        //Dont place ship one next to another
        for (ship of allShipCoords) {

        }

        let shipInfo = {
            starCoord: [coordX, coordY],
            direction: direction,
            allCoords: allShipCoords,
            ship: ship,
        };

        this.#ships.push(shipInfo);
        return true;
    }

    receiveAttack(coordX, coordY) {
        // If coordX or coordY outside the board return
        if (!this.#areCoordsInsideTheBoard(coordX, coordY))
            return "out of bounds";

        // If already hit dont hit again
        if (
            this.#checkIfVectorAlreadyInArray(this.#hits, coordX, coordY) ||
            this.#checkIfVectorAlreadyInArray(this.#misses, coordX, coordY)
        )
            return "already attacked";

        // if vector has a ship, is a hit, miss otherwhise
        let shipInfo = this.#coordHasAShip(coordX, coordY);
        if (shipInfo !== null) {
            this.#hits.push([coordX, coordY]);
            shipInfo.ship.hit();

            //check if ship was sunk
            if (shipInfo.ship.isSunk()) return "sunk";
            else return "hit";
        } else {
            this.#misses.push([coordX, coordY]);
            return "miss";
        }
    }

    allShipsSunk() {
        return this.#ships.every((shipInfo) => shipInfo.ship.isSunk());
    }
}
