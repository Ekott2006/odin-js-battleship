import "./css/reset.css";
import "./css/style.css";
import { GameAttack, ShipDirection } from "./lib/Gameboard";
import Player from "./lib/Player";

// Initial State(When the user is setting his values)
// Select one by default
// When clicked, hover on the div#board should use that div (make a disctintion where it might be)
// When div#board div is clicked, make a call to the lib and confirm position, if yes, show else ignore
// If yes, make that div#board disabled, unable to be clicked
// When done, Create a button , "Start Attack"

const ships = document.querySelector("#ships")
const cursorChangerList = document.querySelectorAll(".cursor-changer");
const playerBoard = document.querySelector("#player-board")
const computerBoard = document.querySelector("#computer-board")
const dialog = document.querySelector("#dialog")
const closeModalList =document.querySelectorAll(".close");
const alertText = document.querySelector("#alert-text")

const PLAYER_CONST = "player";
const COMPUTER_CONST = "computer";
const TRANSPARENT_CONST = "transparent";
const SELECTED_CONST = "selected";
const GOLD_CONST = "gold";
const DISABLED_CONST = "disabled";

let player = new Player();
let computer = new Player(); // Randomly fill in the values

let selectedShip = null;
let direction = ShipDirection.Horizontal;
let isBeggining = true;

// Change Direction
document.onkeyup = (e) => {
  if (e.key.toLowerCase() !== "r") return;

  direction =
    direction == ShipDirection.Horizontal
      ? ShipDirection.Vertical
      : ShipDirection.Horizontal;
};

// Close Modal
closeModalList.forEach((x) => {
  x.onclick = () => {
    dialog.close();
    isBeggining = true;
    clearBoard(PLAYER_CONST, true);
    clearBoard(COMPUTER_CONST, true);
    alertText.textContent = "Place Your Ships. Press R to Rotate(and move)";
    player = new Player();
    computer = new Player();

    (document.getElementById(ships.children[0].id)).click();

    Array.from(playerBoard?.children).forEach((x) => {
      const inputDiv = x;
      inputDiv.style.backgroundColor = TRANSPARENT_CONST;
      x.classList.remove(SELECTED_CONST);
    });
  };
});

// Onclick changes selectedShip (Works only in the first phase)
cursorChangerList.forEach((x) => {
  (x).onclick = () => {
    if (!isBeggining) return;
    cursorChangerList.forEach((x) => x.classList.remove(SELECTED_CONST));
    if (x.classList.contains(DISABLED_CONST)) return;
    x.classList.add(SELECTED_CONST);
    selectedShip = {
      id: x.id,
      data: parseInt((x).dataset.cursorSize ?? ""),
    };
  };
});
(document.getElementById(ships.children[0].id)).click();

Array.from(playerBoard?.children).forEach((x) => {
  const inputDiv = x;
  const row = parseInt(inputDiv.dataset.row ?? "");
  const col = parseInt(inputDiv.dataset.col ?? "");

  inputDiv.onmouseover = () => {
    if (!isBeggining) return;
    clearBoard(PLAYER_CONST);
    if (!selectedShip) return;

    if (direction === ShipDirection.Horizontal) {
      for (let j = col; j < col + selectedShip.data; j++) {
        const elem = document.getElementById(`${PLAYER_CONST}-${row}${j}`);
        if (elem) elem.style.backgroundColor = GOLD_CONST;
      }
    } else {
      for (let j = row; j < row + selectedShip.data; j++) {
        const elem = document.getElementById(`${PLAYER_CONST}-${j}${col}`);
        if (elem) elem.style.backgroundColor = GOLD_CONST;
      }
    }
  };

  inputDiv.onclick = () => {
    // TODO: Check if its accepted
    if (!selectedShip || !isBeggining) return;
    const isSuccessful = player.gameBoard.placeShip(
      { row, col },
      selectedShip.data,
      direction,
      selectedShip.id
    );
    printShips();
    if (isSuccessful) {
      computer.makeRandomShipPlacement(selectedShip);
      changeSelectedShip();
    }
  };
});


// "Start Attack" gives the user access to the computer board, his board becomes disabled
// When you click on the computer board, if there is anything there it turns gold else it turns red
// When a ship is sunk becomes selected
// When all are sunk a modal (dialog) appears saying who won and game restarts

Array.from(computerBoard?.children).forEach((x) => {
  const inputDiv = x;
  const row = parseInt(inputDiv.dataset.row ?? "");
  const col = parseInt(inputDiv.dataset.col ?? "");

  inputDiv.onclick = () => {
    if (isBeggining) return;
    const result = computer.gameBoard.receiveAttack(row, col);
    checkWinner();

    // TODO: Add Computer Random Move
    if (result) player.makeRandomMove();
    printAttacks(computer, COMPUTER_CONST);
    printAttacks(player, PLAYER_CONST);

    computer.gameBoard.ships.forEach((x) => {
      if (!x.ship.isSunk()) return;
      const elem = document.getElementById(x.id);

      elem?.classList.remove(DISABLED_CONST);
      elem?.classList.add(SELECTED_CONST);
    });
    checkWinner();
  };
});


// Helper Functions

function printAttacks(p, idShort) {
  p.gameBoard.attacks.forEach((x) => {
    const elem = document.getElementById(
      `${idShort}-${x.coordinate.row}${x.coordinate.col}`
    );
    if (x.type === GameAttack.Hit) elem.style.backgroundColor = GOLD_CONST;
    else elem.style.backgroundColor = "red";
  });
}

function clearBoard(idShort, force = false) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const elem = document.getElementById(`${idShort}-${row}${col}`);
      if (!elem) return;
      if (force) {
        elem.style.borderColor = "white";
        elem.style.backgroundColor = TRANSPARENT_CONST;
      }
      if (!elem.classList.contains(SELECTED_CONST)) {
        elem.style.backgroundColor = TRANSPARENT_CONST;
      }
    }
  }
}
function checkWinner() {
  const dialogBody = document.querySelector("#dialog-body");
  if (player.gameBoard.hasAllSunk()) {
    dialogBody.textContent = "You Lost. Close to play again.";
    dialog.showModal();
  }
  if (computer.gameBoard.hasAllSunk()) {
    dialogBody.textContent = "You Won. Close to play again.";
    dialog.showModal();
  }
}


function printShips() {
  console.log(player.gameBoard.ships);
  player.gameBoard.ships.forEach((x) => {
    if (x.start.row === x.end.row) {
      for (let i = x.start.col; i <= x.end.col; i++) {
        const elem = document.getElementById(
          `${PLAYER_CONST}-${x.start.row}${i}`
        );
        elem.style.backgroundColor = GOLD_CONST;
        elem.style.borderRightColor = GOLD_CONST;
        elem.classList.add(SELECTED_CONST);
      }
    } else if (x.start.col === x.end.col) {
      for (let i = x.start.row; i <= x.end.row; i++) {
        const elem = document.getElementById(
          `${PLAYER_CONST}-${i}${x.start.col}`
        );
        elem.style.backgroundColor = GOLD_CONST;
        elem.style.borderTopColor = GOLD_CONST;
        elem.classList.add(SELECTED_CONST);
      }
    }
  });
}

function changeSelectedShip() {
  if (!selectedShip || !isBeggining) return;
  document.getElementById(selectedShip.id)?.classList.add(DISABLED_CONST);
  let contains = false;
  Array.from(ships.children)
    .reverse()
    .forEach((x) => {
      if (!x.classList.contains(DISABLED_CONST)) {
        (x).click();
        contains = true;
      }
    });
  if (!contains) {
    // TODO: Make Attack Button Clickable
    selectedShip = null;
    (ships.children[0]).click();
    transitionToNewBoard();
  }
}

function transitionToNewBoard() {
  clearBoard(PLAYER_CONST, true);
  isBeggining = false;
  alertText.textContent =
    "Attack The Computer Ships. Click on the Computer Board";
}