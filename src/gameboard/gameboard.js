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

    #bufferOfTheCoord(coord) {
        const AX = coord[0];
        const AY = coord[1];
        const coordsToReturn = [
            [AX - 1, AY - 1],
            [AX, AY - 1],
            [AX + 1, AY - 1],
            [AX - 1, AY],
            [AX + 1, AY],
            [AX - 1, AY + 1],
            [AX, AY + 1],
            [AX + 1, AY + 1],
        ];
        return coordsToReturn;
    }

    #coordBInsideBufferA(coordA, coordB) {
        const coordsToCheck = this.#bufferOfTheCoord(coordA);
        return this.#checkIfVectorAlreadyInArray(
            coordsToCheck,
            coordB[0],
            coordB[1]
        );
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

        // Calculate all ships coords
        let allShipCoords = [];
        for (let i = 0; i < ship.length; i++) {
            if (direction === "horizontal") {
                allShipCoords.push([coordX + i, coordY]);
            } else {
                allShipCoords.push([coordX, coordY + i]);
            }
        }

        // Dont place if ships overlap or ship is inside the buffer of another ship
        let shipBuffer = [];
        for (let coord of allShipCoords) {
            if (this.#coordHasAShip(coord[0], coord[1]) !== null) return false;

            // Here we get the coord of all the buffe rof the ship
            shipBuffer = [...shipBuffer, ...this.#bufferOfTheCoord(coord)];
        }
        // Manually filter to eliminate repeated buffer coords
        const shipBufferArr = shipBuffer.filter((coord, index, self) =>
            index === self.findIndex(c => c[0] === coord[0] && c[1] === coord[1])
        );

        // Here we check if there is already placed a ship on what would be the buffer of the new ship
        if (
            shipBufferArr.some((bufferCoord) =>
                this.#coordHasAShip(bufferCoord[0], bufferCoord[1])
            )
        )
            return false;

        let shipInfo = {
            starCoord: [coordX, coordY],
            direction: direction,
            allCoords: allShipCoords,
            ship: ship,
        };

        this.#ships.push(shipInfo);
        return true;
    }

    clearGameBoard() {
        this.#hits = [];
        this.#misses = [];
        this.#ships = [];
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
