import GameBoard from "./gameboard.js";
import Ship from "../ship/ship.js";

test("gameboard is correct length", () => {
    const gameBoard = new GameBoard(12, 15);
    expect(gameBoard.x).toBe(12);
    expect(gameBoard.y).toBe(15);
});

test("gameboard starts empty", () => {
    const gameBoard = new GameBoard();
    expect(gameBoard.ships.length).toBe(0);
    expect(gameBoard.misses.length).toBe(0);
    expect(gameBoard.hits.length).toBe(0);
});

test("receive attack on empty cell", () => {
    const gameBoard = new GameBoard();
    const result = gameBoard.receiveAttack(1, 1);
    expect(result).toBe("miss");
});

test("receive attack on ship", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(2);
    gameBoard.placeShip(ship, 1, 1, "horizontal");
    const result = gameBoard.receiveAttack(1, 1);
    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
});

test("place ship on gameboard", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);
    const placed = gameBoard.placeShip(ship, 1, 1, "horizontal");
    expect(placed).toBe(true);
    expect(gameBoard.ships.length).toBe(1);
});

test("Horizontal ships coord saved correctly", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);
    const placed = gameBoard.placeShip(ship, 1, 1, "horizontal");
    const ships = gameBoard.ships;
    expect(ships[0].allCoords[0]).toEqual([1, 1]);
    expect(ships[0].allCoords[1]).toEqual([2, 1]);
    expect(ships[0].allCoords[2]).toEqual([3, 1]);
});

test("Vertical ships coord saved correctly", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);
    const placed = gameBoard.placeShip(ship, 1, 1, "vertical");
    const ships = gameBoard.ships;
    expect(ships[0].allCoords[0]).toEqual([1, 1]);
    expect(ships[0].allCoords[1]).toEqual([1, 2]);
    expect(ships[0].allCoords[2]).toEqual([1, 3]);
});

test("place multiple ship on gameboard", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);
    const ship2 = new Ship(4);
    const ship3 = new Ship(5);
    const ship4 = new Ship(6);
    const placed1 = gameBoard.placeShip(ship, 1, 1, "horizontal");
    const placed2 = gameBoard.placeShip(ship2, 1, 2, "horizontal");
    const placed3 = gameBoard.placeShip(ship3, 1, 3, "horizontal");
    const placed4 = gameBoard.placeShip(ship4, 9, 1, "vertical");
    expect(placed1).toBe(true);
    expect(placed2).toBe(true);
    expect(placed3).toBe(true);
    expect(placed4).toBe(true);
    expect(gameBoard.ships.length).toBe(4);
});

test("Coords ok of multiple ship on gameboard", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);
    const ship2 = new Ship(3);
    gameBoard.placeShip(ship, 1, 1, "horizontal");
    gameBoard.placeShip(ship2, 10, 1, "vertical");

    const ships = gameBoard.ships;
    expect(ships[0].allCoords[0]).toEqual([1, 1]);
    expect(ships[0].allCoords[1]).toEqual([2, 1]);
    expect(ships[0].allCoords[2]).toEqual([3, 1]);

    expect(ships[1].allCoords[0]).toEqual([10, 1]);
    expect(ships[1].allCoords[1]).toEqual([10, 2]);
    expect(ships[1].allCoords[2]).toEqual([10, 3]);
});

test("cannot place overlapping ships", () => {
    const gameBoard = new GameBoard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(4);
    gameBoard.placeShip(ship1, 1, 1, "horizontal");
    const placed = gameBoard.placeShip(ship2, 3, 1, "vertical");
    expect(placed).toBe(false);
    expect(gameBoard.ships.length).toBe(1);
});

test("all ships sunk", () => {
    const gameBoard = new GameBoard();
    const ship1 = new Ship(2);
    const ship2 = new Ship(3);
    gameBoard.placeShip(ship1, 1, 1, "horizontal");
    gameBoard.placeShip(ship2, 1, 3, "horizontal");

    gameBoard.receiveAttack(1, 1);
    gameBoard.receiveAttack(2, 1);
    gameBoard.receiveAttack(1, 3);
    gameBoard.receiveAttack(2, 3);
    gameBoard.receiveAttack(3, 3);

    expect(gameBoard.allShipsSunk()).toBe(true);
});

test("not all ships sunk", () => {
    const gameBoard = new GameBoard();
    const ship1 = new Ship(2);
    const ship2 = new Ship(3);
    gameBoard.placeShip(ship1, 1, 1, "horizontal");
    gameBoard.placeShip(ship2, 1, 3, "horizontal");

    gameBoard.receiveAttack(1, 1);
    gameBoard.receiveAttack(2, 1);
    gameBoard.receiveAttack(1, 3);
    gameBoard.receiveAttack(3, 3);

    expect(gameBoard.allShipsSunk()).toBe(false);
});

test("cannot place ship out of bounds", () => {
    const gameBoard = new GameBoard(5, 5);
    const ship = new Ship(4);
    const placed = gameBoard.placeShip(ship, 3, 4, "horizontal");
    expect(placed).toBe(false);
    expect(gameBoard.ships.length).toBe(0);
});

test("record misses correctly", () => {
    const gameBoard = new GameBoard();
    gameBoard.receiveAttack(3, 3);
    expect(gameBoard.misses.length).toBe(1);
    expect(gameBoard.misses[0]).toEqual([3, 3]);
});

test("cannot attack same cell twice", () => {
    const gameBoard = new GameBoard();
    gameBoard.receiveAttack(1, 1);
    const result = gameBoard.receiveAttack(1, 1);
    expect(result).toBe("already attacked");
});

test("cannot place ship with invalid orientation", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(3);
    const placed = gameBoard.placeShip(ship, 1, 1, "diagonal");
    expect(placed).toBe(false);
    expect(gameBoard.ships.length).toBe(0);
});

test("receive attack out of bounds", () => {
    const gameBoard = new GameBoard(5, 5);
    const result = gameBoard.receiveAttack(6, 6);
    expect(result).toBe("out of bounds");
});

test("place ship at edge of gameboard", () => {
    const gameBoard = new GameBoard(5, 5);
    const ship = new Ship(3);
    const placed = gameBoard.placeShip(ship, 3, 5, "horizontal");
    expect(placed).toBe(true);
    expect(gameBoard.ships.length).toBe(1);
});

test("receive attack sinks ship", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(2);
    gameBoard.placeShip(ship, 1, 1, "horizontal");
    gameBoard.receiveAttack(1, 1);
    const result = gameBoard.receiveAttack(2, 1);
    expect(result).toBe("sunk");
    expect(ship.isSunk()).toBe(true);
});

test("cant place one ship next to another ship", () => {
    const gameBoard = new GameBoard();
    const ship1 = new Ship(5);
    const ship2 = new Ship(3);
    const ship3 = new Ship(2);
    const result1 = gameBoard.placeShip(ship1, 5, 3, "vertical");
    const result2 = gameBoard.placeShip(ship2, 6, 4, "vertical");
    const result3 = gameBoard.placeShip(ship3, 4, 8, "horizontal");
    expect(result1).toBe("cant place next to another ship");
    expect(result2).toBe("cant place next to another ship");
    expect(result3).toBe("cant place next to another ship");

})