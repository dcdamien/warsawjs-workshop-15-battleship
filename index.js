'use strict';

const gameboardArray = [{
  name: 'Gameboard 1',
  array: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  ]
}, {
  name: 'Gameboard 2',
  array: [
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
}];

class BaseElement {
  createElement() {
  }

  getElement() {
    return this.elementState.element;
  }

  initialize() {}

  setElement() {
    this.elementState = {
      element: this.createElement()
    }
    this.initialize();
    return this.getElement();
  }
}

class Cell extends BaseElement {
  constructor({
    isShip,
    location,
    gameboard
  }) {
    super();
    this.isShip = isShip;
    this.location = location;
    this.state = 'unknown';
    this.onClick = this.fire;
    this.gameboard = gameboard;
  }

  createElement() {
    const element = document.createElement('div');
    element.addEventListener('click', this.onClick.bind(this));
    return element;
  }

  setState(state) {
    this.state = state;
    this.refresh();
  }

  refresh() {
    this.getElement().className = 'cell-' + this.state;
  }

  fire() {
    if (this.isShip) {
      if (this.state === 'unknown') {
        this.gameboard.score += 1;
      }
      gameResult.innerHTML = '';
      gameResult.append(`${this.gameboard.score}/${this.gameboard.totalScore}`);
      this.setState('hit');
    } else {
      this.setState('miss');
    }
  }

  initialize() {
    this.refresh();
  }
}

class Gameboard extends BaseElement {
  constructor({
    size
  }) {
    super();
    this.cells = [];
    this.rowNumber = size;
    this.columnNumber = size;
    this.fleet = gameboardArray[Math.floor(Math.random() * gameboardArray.length)]
    this.score = 0;
    this.totalScore = this.getTotalScore(this.fleet);

    for (let rowIndex = 0; rowIndex < this.rowNumber; ++rowIndex) {
      for (let columnIndex = 0; columnIndex < this.columnNumber; ++columnIndex) {
        this.cells.push(new Cell({
          isShip: this.fleet.array[rowIndex][columnIndex] === 1,
          location: [rowIndex, columnIndex],
          gameboard: this
        }));
      }
    }
    gameResult.append(`${this.score}/${this.totalScore}`)
  }

  createElement() {
    const gameboard = document.createElement('div');
    gameboard.className = 'gameboard';

    for (let rowIndex = 0; rowIndex < this.rowNumber; ++rowIndex) {
      const row = document.createElement('div');
      row.className = 'board-row';

      for (let columnIndex = 0; columnIndex < this.columnNumber; ++columnIndex) {
        const cell = this.cells[rowIndex * this.columnNumber + columnIndex];
        row.appendChild(cell.setElement());
      }
      gameboard.appendChild(row);
    }
    return gameboard;
  }

  getTotalScore(fleet) {
    let total = 0;

    fleet.array.forEach((row) => {
      total += row.filter((x) => {
        return x === 1
      }).length
    });

    return total;
  }
}

const gameboardContainer = document.getElementById('gameboardContainer');
const gameResult = document.getElementById('gameResult')
const gameboard = new Gameboard({
  size: 10
});
gameboardContainer.appendChild(gameboard.setElement());
