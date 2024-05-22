export default class Ship {
  size;
  hits;
  constructor(size) {
    this.size = size;
    this.hits = 0;
  }

  hit() {
    if (!this.isSunk()) this.hits++;
  }
  isSunk() {
    return this.size <= this.hits;
  }
}
