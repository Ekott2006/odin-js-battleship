import Ship from "../lib/Ship";

describe("Ship", () => {
  describe("isSunk()", () => {
    test("returns true when hits equal length", () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });

    test("returns true when hits more than size", () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      ship.hit();
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
    test("returns false when hits are less than length", () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(false);
    });
  });
});
