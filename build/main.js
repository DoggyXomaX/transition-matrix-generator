const App = {
  elements: null,
  state: {
    offset: { x: 0, y: 0 },
    mouse: {
      isDown: false,
      start: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
    },
    grid: [],
  },
  settings: {
    countX: 5,
    countY: 5,
    scale: 1,
    scaleStep: 0.8,
    gridElementSize: 30,
  },
};
  
App.OnCountXChanged = (e) => {
  const reg = /\d*/g.exec(e.target.value);
  App.SetCountX(reg[0] ? +reg[0] : undefined);
};
App.OnCountYChanged = (e) => {
  const reg = /\d*/g.exec(e.target.value);
  App.SetCountY(reg[0] ? +reg[0] : undefined);
};

App.OnScaleWheel = (e) => (e.deltaY > 0 ? App.OnScaleDown : App.OnScaleUp)();
App.OnScaleChanged = (e) => {
  const reg = /[0-9\.]*/g.exec(e.target.value);
  App.SetScale(reg[0] ? +reg[0] * 0.01 : undefined);
};
App.OnScaleUp = () => App.SetScale(App.settings.scale / App.settings.scaleStep);
App.OnScaleDown = () => App.SetScale(App.settings.scale * App.settings.scaleStep);
App.OnScaleReset = () => App.SetScale(1);

App.OnMovingDown = (e) => {
  if (e.target !== App.elements.mainObject) return;
  if (e.button !== 0) return;
  const { mouse } = App.state;
  mouse.start.x = e.screenX;
  mouse.start.y = e.screenY;
  mouse.current.x = mouse.start.x;
  mouse.current.y = mouse.start.y;
  mouse.isDown = true;
};
App.OnMovingMove = (e) => {
  const { mouse, offset } = App.state;
  if (!mouse.isDown) return;
  mouse.current.x = e.screenX;
  mouse.current.y = e.screenY;
  const { x, y } = mouse.start;
  const dx = mouse.current.x - x;
  const dy = mouse.current.y - y;
  App.Var('offset-x', `${offset.x + dx}px`);
  App.Var('offset-y', `${offset.y + dy}px`);
};
App.OnMovingUp = (e) => {
  if (e.button !== 0) return;
  const { mouse, offset } = App.state;
  if (!mouse.isDown) return;
  mouse.isDown = false;
  App.SetOffset(
    offset.x + mouse.current.x - mouse.start.x,
    offset.y + mouse.current.y - mouse.start.y,
  );
};
App.OnMovingReset = () => App.SetOffset(0, 0);

App.OnCellClick = function() {
  const { element } = this;
  App.SetGridElement(element, { direction: element.direction + 1 });
};
App.OnCellContext = function(e) {
  e.preventDefault();
  const { element } = this;
  App.SetGridElement(element, { direction: element.direction - 1 });
};

App.OnGenerate = () => App.Generate();

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

App.SetCountX = (value) => {
  if (!value) value = App.settings.countX;
  App.settings.countX = value;
  App.elements.countXInput.value = value;
};

App.SetCountY = (value) => {
  if (!value) value = App.settings.countY;
  App.settings.countY = value;
  App.elements.countYInput.value = value;
};

App.SetGridElement = (element, options) => {
  let direction = options.direction;
  if (direction !== undefined) {
    direction = Number.isNaN(+direction) ? 0 : +direction;
    App.VarElem(element.arrow, 'r', `${direction * 90}deg`);
    App.VarElem(element.number, 'r', `${-direction * 90}deg`);
    element.direction = direction;
  }
  
  let index = options.index;
  if (index !== undefined) {
    index = Number.isNaN(+index) ? 0 : +index;
    element.index = index;
  }
  
  let count = options.count;
  if (count !== undefined) {
    count = Number.isNaN(+count) ? 0 : +count;
    element.count = count;
    if (element.count === 0) 
      element.arrow.className = 'arrow__icon arrow__icon--last';
    else
      element.arrow.className = 'arrow__icon';
  }

  element.number.innerText = `${element.index},${element.count}`;
};
App.SetGridElementXY = (x, y, options) => App.SetGridElement(App.state.grid[y][x], options);
App.Generate = async () => {
  const { gridElementSize, countX, countY } = App.settings;
  const { articleObject } = App.elements;
  App.state.grid = App.CreateGrid({
    gridElementSize, countX, countY,
    articleObject,
  });

  const grid = await App.Trace(countX, countY);
  console.log(grid);
  for (let y = 0, i = 0; y < countY; y++) {
    for (let x = 0; x < countX; x++, i++) {
      App.SetGridElementXY(x, y, grid[i]);
    }
  }
};

App.CreateArrowElement = () => {
  const span = App.Create('span');
  const arrowSpan = App.Create('span');
  const numberSpan = App.Create('span');
  span.className = 'arrow';
  arrowSpan.className = 'arrow__icon';
  numberSpan.className = 'arrow__number';
  span.appendChild(arrowSpan);
  arrowSpan.appendChild(numberSpan);

  span.addEventListener('click', App.OnCellClick, true);
  span.addEventListener('contextmenu', App.OnCellContext, true);
  span.addEventListener('mousedown', function(e) { e.stopPropagation(); e.preventDefault(); }, true);
  arrowSpan.addEventListener('mousedown', function(e) { e.stopPropagation(); e.preventDefault(); }, true);
  numberSpan.addEventListener('mousedown', function(e) { e.stopPropagation(); e.preventDefault(); }, true);

  const element = {
    span: span,
    arrow: arrowSpan,
    number: numberSpan,
    direction: 0,
    index: 0,
    count: 0,
  };
  span.element = element;

  return element;
};
App.CreateGrid = (options) => {
  const { articleObject, gridElementSize, countX, countY } = options;
  articleObject.innerHTML = '';
  articleObject.style.width = `${countX * gridElementSize}px`;
  articleObject.style.height = `${countY * gridElementSize}px`;

  const grid = new Array(countY);
  for (let y = 0, index = 0; y < countY; y++) {
    grid[y] = new Array(countX);
    for (let x = 0; x < countX; x++, index++) {
      const element = App.CreateArrowElement();
      App.elements.articleObject.appendChild(element.span);
      App.SetGridElement(element, {index, count: 0});
      grid[y][x] = element;
    }
  }

  return grid;
};

App.Trace = async (countX, countY) => {
  const map = new Array(countX * countY);
  let count = 1;
  let currentNode = {
    prev: null,
    x: Math.random() * countX >> 0,
    y: Math.random() * countY >> 0,
    targets: null,
    targetIndex: null,
  };

  const FindEmptyCells = (x, y) => {
    const arr = new Array(countX + countY - 2);
    let p = 0;

    for (let i = 0; i < countX; i++)
      if (i !== x && !map[y * countX + i])
        arr[p++] = {x: i, y};
    for (let i = 0; i < countY; i++)
      if (i !== y && !map[i * countX + x])
        arr[p++] = {x, y: i};

    arr.length = p;
    return arr;
  };

  for (let i = 0, k = countX * countY; i < k; i++) map[i] = false;
  currentNode.targets = FindEmptyCells(currentNode.x, currentNode.y);
  map[currentNode.y * countX + currentNode.x] = true;

  while (count != countX * countY) {
    if (currentNode.targets.length === 0) {
      count--;
      map[currentNode.y * countX + currentNode.x] = false;
      currentNode = currentNode.prev;
      currentNode.targets.splice(currentNode.targetIndex, 1);
    } else {
      currentNode.targetIndex = Math.random() * currentNode.targets.length >> 0;
      const pos = currentNode.targets[currentNode.targetIndex];
      const newNode = {
        prev: currentNode,
        x: pos.x,
        y: pos.y,
        targets: FindEmptyCells(pos.x, pos.y),
        targetIndex: null,
      };
      currentNode = newNode;
      map[pos.y * countX + pos.x] = true;
      count++;
    }
  }

  const grid = new Array(count);
  let index = count - 1;
  let direction = 0;
  count = 0;
  grid[currentNode.y * countX + currentNode.x] = { index, direction, count };

  while (index--) {
    const posX = currentNode.x;
    const posY = currentNode.y;
    
    currentNode = currentNode.prev;
    const prevX = currentNode.x;
    const prevY = currentNode.y;
    
    const dx = posX - prevX;
    const dy = posY - prevY;
    
    if (dx > 0) direction = 2;
    else if (dy < 0) direction = 1;
    else if (dy > 0) direction = 3;
    else direction = 0;
    count = Math.abs(dx + dy);

    grid[prevY * countX + prevX] = { index, direction, count };
  }

  return grid;
};

/* Main methods */
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
    countXInput, countYInput,
    scaleInput, scaleUpButton, scaleDownButton, scaleResetButton, offsetResetButton,
    mainObject,
  } = App.elements;
 
  generateButton.addEventListener('click', App.OnGenerate);

  countXInput.addEventListener('change', App.OnCountXChanged, true);
  countYInput.addEventListener('change', App.OnCountYChanged, true);

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

/* Shortcuts */
App.Tag = (tag) => document.getElementsByTagName(tag);
App.Class = (className) => document.getElementsByClassName(className);
App.Get = (id) => document.getElementById(id);
App.Var = (name, value) => document.documentElement.style.setProperty(`--${name}`, value);
App.VarElem = (element, name, value) => element.style.setProperty(`--${name}`, value);
App.Create = (tag) => document.createElement(tag);

/* Init */
App.Start = () => {
  App.elements = App.GetElements();
  App.PrepareElements();
};

window.onload = App.Start;
