App.GetElements = () => {
  const tags = [
    ...App.Tag('input'),
    ...App.Tag('button'),
    ...App.Tag('article'),
    ...App.Tag('main'),
  ];
  const elements = {};
  tags.forEach(e => elements[e.id] = e);
  return elements;
};
App.PrepareElements = () => {
  const {
    generateButton,
    scaleInput, scaleUpButton, scaleDownButton, scaleResetButton, offsetResetButton,
    mainObject,
  } = App.elements;

  generateButton.addEventListener('click', App.OnGenerate);

  scaleInput.addEventListener('change', App.OnScaleChanged, true);
  scaleUpButton.addEventListener('click', App.OnScaleUp);
  scaleDownButton.addEventListener('click', App.OnScaleDown);
  scaleResetButton.addEventListener('click', App.OnScaleReset);
  offsetResetButton.addEventListener('click', App.OnMovingReset);

  mainObject.addEventListener('wheel', App.OnScaleWheel, true);
  mainObject.addEventListener('mousedown', App.OnMovingDown, true);
  window.addEventListener('mouseup', App.OnMovingUp, true);
  mainObject.addEventListener('mousemove', App.OnMovingMove, true);

  App.SetScale(App.state.scale);
  App.Generate();
};
App.SetScale = (value) => {
  if (!value) value = App.settings.scale;
  App.settings.scale = value;
  App.elements.scaleInput.value = `${(value * 100).toFixed(2)}%`;
  App.Var('scale', value);
};
App.SetOffset = (x, y) => {
  x = Number.isNaN(+x) ? App.state.offset.x : x;
  y = Number.isNaN(+y) ? App.state.offset.y : y;
  App.state.offset.x = x;
  App.state.offset.y = y;
  App.Var('offset-x', `${x}px`);
  App.Var('offset-y', `${y}px`);
};
App.SetGridElement = (element, options) => {
  let direction = options.direction;
  let index = options.index;
  let count = options.count;
  if (direction !== undefined) {
    direction = Number.isNaN(+direction) ? 0 : +direction;
    direction = Math.min(Math.max(direction, 0), 3);
    direction *= 90;
    App.VarElem(element.arrow, 'r', `${direction}deg`);
    App.VarElem(element.number, 'r', `${-direction}deg`);
    element.direction = direction;
  }

  if (index !== undefined) {
    index = Number.isNaN(+index) ? 0 : +index;
    element.index = index;
  }
  
  if (count !== undefined) {
    count = Number.isNaN(+count) ? 0 : +count;
    element.count = count;
  }

  element.number.innerText = `${element.index},${element.count}`;
};
App.SetGridElementXY = (x, y, options) => App.SetGridElement(App.state.grid[y][x], options);
App.Generate = () => {
  const { gridElementSize, countX, countY } = App.settings;
  const { articleObject } = App.elements;
  App.state.grid = App.CreateGrid({
    gridElementSize, countX, countY,
    articleObject,
  });
};
