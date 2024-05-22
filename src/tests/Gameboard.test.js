import Gameboard, { GameAttack, ShipDirection } from "../lib/Gameboard";

describe("Gameboard class", () => {
  // Invalid Row
  // Invalid Column
  // Valid Row and Column but size + row makes it invalid
  // Valid Row and Column but size + col makes it valid
  // Multiple on the same area only one 1 seen
  // Multiple on different areas all visible
  describe("placeShip()", () => {
    describe("placeShip() VERTICAL", () => {
      test("placeShip() when row is invalid, ships length is 0", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: -1, col: 0 }, 2, ShipDirection.Vertical);

        // Assert
        expect(board.ships).toHaveLength(0);
      });
      test("placeShip() when column is invalid, ships length is 0", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 0, col: 15 }, 2, ShipDirection.Vertical);

        // Assert
        expect(board.ships).toHaveLength(0);
      });
      test("placeShip() when row and column is valid, but size makes it invalid, ship length is 0", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 8, col: 0 }, 3, ShipDirection.Vertical);
        expect(board.ships).toHaveLength(0);
      });
      test("placeShip() when row and column and size is valid, ship length is 1", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 0, col: 8 }, 3, ShipDirection.Vertical);

        expect(board.ships).toHaveLength(1);
        expect(board.ships[0].start).toEqual({ row: 0, col: 8 });
        expect(board.ships[0].end).toEqual({ row: 2, col: 8 });
      });
      test("placeShip() multiple overlapping ships, ship length is 1", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 0, col: 8 }, 3, ShipDirection.Vertical);
        board.placeShip({ row: 1, col: 8 }, 3, ShipDirection.Vertical);
        board.placeShip({ row: 2, col: 8 }, 3, ShipDirection.Vertical);

        expect(board.ships).toHaveLength(1);
        expect(board.ships[0].start).toEqual({ row: 0, col: 8 });
        expect(board.ships[0].end).toEqual({ row: 2, col: 8 });
      });
      test("placeShip() with multiple ships, ship length is 3", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 0, col: 8 }, 3, ShipDirection.Vertical);
        board.placeShip({ row: 1, col: 6 }, 3, ShipDirection.Vertical);
        board.placeShip({ row: 2, col: 7 }, 3, ShipDirection.Vertical);

        expect(board.ships).toHaveLength(3);
      });
    });

    describe("placeShip() HORIZONTAL", () => {
      test("placeShip() when row is invalid, ships length is 0", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: -1, col: 0 }, 2, ShipDirection.Horizontal);

        // Assert
        expect(board.ships).toHaveLength(0);
      });
      test("placeShip() when column is invalid, ships length is 0", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 0, col: 15 }, 2, ShipDirection.Horizontal);

        // Assert
        expect(board.ships).toHaveLength(0);
      });
      test("placeShip() when row and column is valid, but size makes it invalid, ship length is 0", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 0, col: 8 }, 3, ShipDirection.Horizontal);
        expect(board.ships).toHaveLength(0);
      });
      test("placeShip() when row and column and size is valid, ship length is 1", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 8, col: 0 }, 3, ShipDirection.Horizontal);

        expect(board.ships).toHaveLength(1);
        expect(board.ships[0].start).toEqual({ row: 8, col: 0 });
        expect(board.ships[0].end).toEqual({ row: 8, col: 2 });
      });
      test("placeShip() multiple overlapping ships, ship length is 1", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 8, col: 0 }, 3, ShipDirection.Horizontal);
        board.placeShip({ row: 8, col: 1 }, 3, ShipDirection.Horizontal);
        board.placeShip({ row: 8, col: 2 }, 3, ShipDirection.Horizontal);

        expect(board.ships).toHaveLength(1);
        expect(board.ships[0].start).toEqual({ row: 8, col: 0 });
        expect(board.ships[0].end).toEqual({ row: 8, col: 2 });
      });
      test("placeShip() with multiple ships, ship length is 3", () => {
        // Act
        const board = new Gameboard();
        board.placeShip({ row: 0, col: 0 }, 3, ShipDirection.Horizontal);
        board.placeShip({ row: 1, col: 1 }, 3, ShipDirection.Horizontal);
        board.placeShip({ row: 2, col: 2 }, 3, ShipDirection.Horizontal);

        expect(board.ships).toHaveLength(3);
      });
    });
  });

  // Missed Shots
  // Hit
  // Sink Ship
  describe("receiveAttack()", () => {
    test("should record missed shots correctly", () => {
      const board = new Gameboard();
      const row = 0;
      const col = 0;
      board.receiveAttack(row, col);
      expect(board.attacks).toHaveLength(1);
      expect(board.attacks[0]).toEqual({
        type: GameAttack.Miss,
        coordinate: { row, col },
      });
    });

    test("should hit the ship correctly", () => {
      const board = new Gameboard();
      const row = 0;
      const col = 0;
      board.placeShip({ row, col }, 3, ShipDirection.Horizontal);
      board.receiveAttack(row, col + 1);

      expect(board.attacks).toHaveLength(1);
      expect(board.attacks[0]).toEqual({
        type: GameAttack.Hit,
        coordinate: { row, col: col + 1 },
      });
      expect(board.ships[0].ship.hits).toEqual(1);
    });

    test("should sink the ship if all parts are hit", () => {
      const board = new Gameboard();
      const row = 0;
      const col = 0;
      board.placeShip({ row, col }, 3, ShipDirection.Horizontal);
      board.receiveAttack(row, col);
      board.receiveAttack(row, col + 1);
      board.receiveAttack(row, col + 2);

      expect(board.attacks).toHaveLength(3);

      expect(board.ships[0].ship.isSunk()).toEqual(true);
    });

    test("should not hit a ship if coordinates are out of bounds", () => {
      const board = new Gameboard();
      const row = 0;
      const col = 0;
      board.placeShip({ row, col }, 3, ShipDirection.Horizontal);
      board.receiveAttack(11, 11);

      expect(board.attacks).toHaveLength(0);
    });
  });

  describe("hasAllSunk()", () => {
    test("should be false if some ships are sunk", () => {
      const board = new Gameboard();
      const row1 = 0;
      const col1 = 0;
      board.placeShip({ row: row1, col: col1 }, 3, ShipDirection.Horizontal);

      const row2 = 5;
      const col2 = 4;
      board.placeShip({ row: row2, col: col2 }, 2, ShipDirection.Vertical);
      board.receiveAttack(row2, col2);
      board.receiveAttack(row2 + 1, col2);

      expect(board.hasAllSunk()).toBeFalsy();
    });

    test("should be true if all ships are sunk", () => {
      const board = new Gameboard();
      const row1 = 0;
      const col1 = 0;
      board.placeShip({ row: row1, col: col1 }, 3, ShipDirection.Horizontal);
      board.receiveAttack(row1, col1);
      board.receiveAttack(row1, col1 + 1);
      board.receiveAttack(row1, col1 + 2);

      const row2 = 5;
      const col2 = 4;
      board.placeShip({ row: row2, col: col2 }, 2, ShipDirection.Vertical);
      board.receiveAttack(row2, col2);
      board.receiveAttack(row2 + 1, col2);

      expect(board.hasAllSunk()).toBeTruthy();
    });
  });
});
