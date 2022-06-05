enum ArrowDirection { Left, Up, Right, Down }
type ArrowGrid = ArrowElement[][];

class GridOptions {
  gridElementSize: number;
  countX: number;
  countY: number;

  constructor(gridElementSize: number, countX: number, countY: number) {
    this.gridElementSize = gridElementSize;
    this.countX = countX;
    this.countY = countY;
  }
}

class ArrowElementOptions {
  direction: ArrowDirection;
  count: number;
  index: number;

  constructor(direction: ArrowDirection, count: number, index: number) {
    this.direction = direction;
    this.count = count;
    this.index = index;
  }
}

class ArrowElement {
  spanElement: HTMLElement;
  arrowElement: HTMLElement;
  numberElement: HTMLElement;
  direction: ArrowDirection = ArrowDirection.Left;
  index: number = 0;
  count: number = 0;

  constructor(appEvents: AppEvents) {
    this.numberElement = document.createElement('span');
    this.numberElement.className = 'arrow__number';

    this.arrowElement = document.createElement('span');
    this.arrowElement.className = 'arrow__icon';
    this.arrowElement.appendChild(this.numberElement);

    this.spanElement = document.createElement('span');
    this.spanElement.className = 'arrow';
    this.spanElement.appendChild(this.arrowElement);

    const arrow = this;

    this.spanElement.addEventListener('click', (e) => appEvents.OnCellClick(arrow, e), true);
    this.spanElement.addEventListener('contextmenu', (e) => appEvents.OnCellContext(arrow, e), true);
  }

  RotateRight() {
    switch (this.direction) {
      case ArrowDirection.Left: this.direction = ArrowDirection.Up; break;
      case ArrowDirection.Up: this.direction = ArrowDirection.Right; break;
      case ArrowDirection.Right: this.direction = ArrowDirection.Down; break;
      case ArrowDirection.Down: this.direction = ArrowDirection.Left; break;
    }
    this.SetDirection(this.direction);
  }

  RotateLeft() {
    switch (this.direction) {
      case ArrowDirection.Left: this.direction = ArrowDirection.Down; break;
      case ArrowDirection.Up: this.direction = ArrowDirection.Left; break;
      case ArrowDirection.Right: this.direction = ArrowDirection.Up; break;
      case ArrowDirection.Down: this.direction = ArrowDirection.Right; break;
    }
    this.SetDirection(this.direction);
  }

  SetDirection(direction: ArrowDirection) {
    this.direction = direction;
    VarElem(this.arrowElement, 'r', `${this.direction * 90}deg`);
    VarElem(this.numberElement, 'r', `${-this.direction * 90}deg`);
  }
}

class AppGraphics {
  parent: AppClass;

  constructor(parent: AppClass) {
    this.parent = parent;
  }

  CreateGrid(options: GridOptions): ArrowGrid | null {
    const { events, elements, methods } = this.parent;
    const { articleObject } = elements;
    const { gridElementSize, countX, countY } = options;
    if (articleObject === null) return null;
    articleObject.innerHTML = '';
    articleObject.style.width = `${countX * gridElementSize}px`;
    articleObject.style.height = `${countY * gridElementSize}px`;

    const grid: ArrowGrid = new Array<Array<ArrowElement>>(countY);
    for (let y = 0, i = 0; y < countY; y++) {
      grid[y] = new Array<ArrowElement>(countX);
      for (let x = 0; x < countX; x++, i++) {
        const arrow = new ArrowElement(events);
        articleObject.appendChild(arrow.spanElement);
        methods.SetGridElement(arrow, new ArrowElementOptions(ArrowDirection.Left, i, 0));
        grid[y][x] = arrow;
      }
    }

    return grid;
  }
}
