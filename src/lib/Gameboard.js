import Ship from "./Ship";

export default class Gameboard {
  ships;
  attacks;
  gridSize = 10;

  constructor() {
    this.ships = [];
    this.attacks = [];
  }

  placeShip(start, size, direction, id = crypto.randomUUID()) {
    const ship = new Ship(size);
    const isHorizontal = direction === ShipDirection.Horizontal;
    const data = {
      id,
      ship,
      start,
      end: {
        row: isHorizontal ? start.row : start.row + size - 1,
        col: isHorizontal ? start.col + size - 1 : start.col,
      },
    };
    if (
      data.start.row < 0 ||
      data.end.row >= this.gridSize ||
      data.start.col < 0 ||
      data.end.col >= this.gridSize
    )
      return false;
    if (
      !this.ships.every((x) => {
        if (x.start.row === x.end.row && isHorizontal)
          return (
            data.end.row !== x.end.row ||
            data.end.col < x.start.col ||
            data.start.col > x.end.col
          );
        if (x.start.row === x.end.row && !isHorizontal)
          return (
            data.start.row > x.start.row ||
            data.end.row < x.start.row ||
            data.start.col < x.start.col ||
            data.start.col > x.end.col
          );
        if (x.start.row !== x.end.row && isHorizontal)
          return (
            data.start.col > x.start.col ||
            data.end.col < x.start.col ||
            data.start.row < x.start.row ||
            data.start.row > x.end.row
          );
        if (x.start.row !== x.end.row && !isHorizontal)
          return (
            data.end.col !== x.end.col ||
            data.end.row < x.start.row ||
            data.start.row > x.end.row
          );
      })
    )
      return false;
    this.ships.push(data);
    return true;
  }

  receiveAttack(row, col) {
    if (row >= this.gridSize || col >= this.gridSize) return false;
    if (
      !this.attacks.every(
        (x) => x.coordinate.row !== row || x.coordinate.col !== col
      )
    )
      return false;

    const index = this.ships.findIndex(
      (x) =>
        row >= x.start.row &&
        row <= x.end.row &&
        col >= x.start.col &&
        col <= x.end.col
    );
    if (index === -1) {
      this.attacks.push({ coordinate: { row, col }, type: GameAttack.Miss });
      return true;
    }
    this.ships[index].ship.hit();
    this.attacks.push({ coordinate: { row, col }, type: GameAttack.Hit });
    return true;
  }

  hasAllSunk() {
    return this.ships.every((x) => x.ship.isSunk());
  }
}

export const ShipDirection = {
  Horizontal: 0,
  Vertical: 1,
};

export const GameAttack = {
  Hit: 0,
  Miss: 1,
};
