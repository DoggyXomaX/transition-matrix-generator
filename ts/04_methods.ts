class AppMethods {
  parent: AppClass;

  constructor(parent: AppClass) {
    this.parent = parent;
  }

  SetScale(scale?: number) {
    const { settings, elements } = this.parent;
    const { scaleInput } = elements;
    if (scale !== undefined)
      settings.scale = scale;
    if (scaleInput !== null)
      scaleInput.value = `${(settings.scale * 100).toFixed(2)}%`;
    Var('scale', settings.scale);
  }

  SetOffset(x?: number, y?: number) {
    const { offset } = this.parent.state;
    if (x !== undefined && y !== undefined) {
      offset.x = x;
      offset.y = y;
    }
    Var('offset-x', `${offset.x}px`);
    Var('offset-y', `${offset.y}px`);
  }

  SetCountX(countX?: number) {
    const { settings } = this.parent;
    const { countXInput } = this.parent.elements;
    if (countXInput === null) return;

    if (countX !== undefined)
      settings.countX = countX;
    countXInput.value = `${settings.countX}`;
  }

  SetCountY(countY?: number) {
    const { settings } = this.parent;
    const { countYInput } = this.parent.elements;
    if (countYInput === null) return;

    if (countY !== undefined)
      settings.countY = countY;
    countYInput.value = `${settings.countY}`;
  }

  SetGridElement(element: ArrowElement, options: ArrowElementOptions) {
    const { arrowElement, numberElement } = element;
    const { direction, count, index } = options;

    element.SetDirection(direction);

    element.count = count;
    if (element.count === 0)
      arrowElement.className = 'arrow__icon arrow__icon--last';
    else
      arrowElement.className = 'arrow__icon';

    element.index = index;

    numberElement.innerText = `${element.index},${element.count}`;
  }

  SetGridElementXY(x: number, y: number, options: ArrowElementOptions) {
    this.SetGridElement(app.state.grid[y][x], options);
  }

  async Generate() {
    const { settings, elements, state, graphics, tracer } = this.parent;
    const { gridElementSize, countX, countY } = settings;
    const { articleObject } = elements;

    if (articleObject === null) return;

    state.grid = graphics.CreateGrid(new GridOptions(gridElementSize, countX, countY));

    const grid = await tracer.Trace(countX, countY);
    for (let y = 0, i = 0; y < countY; y++)
      for (let x = 0; x < countX; x++, i++)
        this.SetGridElementXY(x, y, grid[i]);
  }
}