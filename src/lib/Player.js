import Gameboard, { ShipDirection } from "./Gameboard";

export default class Player {
  gameBoard = new Gameboard();

  makeRandomMove() {
    let result = false;
    while (!result) {
      let row = Math.round(Math.random() * this.gameBoard.gridSize);
      let col = Math.round(Math.random() * this.gameBoard.gridSize);
      result = this.gameBoard.receiveAttack(row, col);
    }
  }

  makeRandomShipPlacement({data, id}) {
      let result = false;
      while (!result) {
        let row = Math.round(Math.random() * this.gameBoard.gridSize);
        let col = Math.round(Math.random() * this.gameBoard.gridSize);
        let direction =
          Math.round(Math.random()) <= 0.5
            ? ShipDirection.Horizontal
            : ShipDirection.Vertical;
        console.log(result);

        result = this.gameBoard.placeShip({ row, col }, data, direction, id);
      }
  }
}
