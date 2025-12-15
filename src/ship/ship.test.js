import Ship from "./ship.js";

test("Ship initializes with correct length and no hits", () => {
    const myShip = new Ship(4);
    expect(myShip.length).toBe(4);
    expect(myShip.hits).toBe(0);
});

test("Ship registers hits correctly", () => {
    const myShip = new Ship(3);
    myShip.hit();
    expect(myShip.hits).toBe(1);
    myShip.hit();
    expect(myShip.hits).toBe(2);
});

test("Ship reports sunk status correctly", () => {
    const myShip = new Ship(2);
    expect(myShip.isSunk()).toBe(false);
    myShip.hit();
    expect(myShip.isSunk()).toBe(false);
    myShip.hit();
    expect(myShip.isSunk()).toBe(true);
});
