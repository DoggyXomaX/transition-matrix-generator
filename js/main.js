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

/* Events */
App.OnScaleWheel = (e) => (e.deltaY > 0 ? App.OnScaleDown : App.OnScaleUp)();
App.OnScaleChanged = (e) => {
  const reg = /[0-9\.]*/g.exec(e.target.value);
  App.SetScale(reg[0] ? +reg[0] * 0.01 : undefined);
};
App.OnScaleUp = () => App.SetScale(App.settings.scale / App.settings.scaleStep);
App.OnScaleDown = () => App.SetScale(App.settings.scale * App.settings.scaleStep);
App.OnScaleReset = () => App.SetScale(1);

App.OnMovingDown = (e) => {
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
App.OnMovingUp = () => {
  const { mouse, offset } = App.state;
  if (!mouse.isDown) return;
  mouse.isDown = false;
  App.SetOffset(
    offset.x + mouse.current.x - mouse.start.x,
    offset.y + mouse.current.y - mouse.start.y,
  );
};
App.OnMovingReset = () => App.SetOffset(0, 0);

/* Methods */
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
  App.elements.scaleInput.addEventListener('change', App.OnScaleChanged, true);
  App.elements.scaleUpButton.addEventListener('click', App.OnScaleUp);
  App.elements.scaleDownButton.addEventListener('click', App.OnScaleDown);
  App.elements.scaleResetButton.addEventListener('click', App.OnScaleReset);

  App.elements.mainObject.addEventListener('wheel', App.OnScaleWheel, true);
  App.elements.mainObject.addEventListener('mousedown', App.OnMovingDown, true);
  window.addEventListener('mouseup', App.OnMovingUp, true);
  App.elements.mainObject.addEventListener('mousemove', App.OnMovingMove, true);
  App.elements.offsetResetButton.addEventListener('click', App.OnMovingReset);

  App.SetScale(App.state.scale);
};
App.SetScale = (value) => {
  if (!value) value = App.settings.scale;
  App.settings.scale = value;
  App.elements.scaleInput.value = `${(value * 100).toFixed(2)}%`;
  App.Var('scale', value);
};
App.SetOffset = (x, y) => {
  console.log({x,y});
  x = Number.isNaN(+x) ? App.state.offset.x : x;
  y = Number.isNaN(+y) ? App.state.offset.y : y;
  App.state.offset.x = x;
  App.state.offset.y = y;
  App.Var('offset-x', `${x}px`);
  App.Var('offset-y', `${y}px`);
};
App.SetGridElement = (element, direction, value) => {
  direction = Number.isNaN(+direction) ? 0 : +direction;
  direction = Math.min(Math.max(direction, 0), 3);
  direction *= 90;
  App.VarElem(element.arrow, 'r', `${direction}deg`);
  App.VarElem(element.number, 'r', `${-direction}deg`);
  element.number.innerText = value;
};
App.Generate = () => {
  const { articleObject } = App.elements;
  const { gridElementSize, countX, countY } = App.settings;
  articleObject.innerHTML = '';
  articleObject.style.width = `${countX * gridElementSize}px`;
  articleObject.style.height = `${countY * gridElementSize}px`;
};

/* Graphics */
App.CreateArrowElement = (size) => {
  const span = App.Create('span');
  span.className = 'arrow';
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;

  const arrowSpan = App.Create('span');
  arrowSpan.className = 'arrow__icon';
  arrowSpan.style.width = `${size - 8}px`;
  arrowSpan.style.height = `${size - 8}px`;
  span.appendChild(arrowSpan);

  const numberSpan = App.Create('span');
  numberSpan.className = 'arrow__number';
  numberSpan.innerText = '12';
  arrowSpan.appendChild(numberSpan);

  return {
    span: span,
    arrow: arrowSpan,
    number: numberSpan,
    direction: 0,
  };
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

  // test
  const element = App.CreateArrowElement(30);
  App.SetGridElement(element, 1, 'Х');
  App.elements.articleObject.appendChild(element.span);
};

window.onload = App.Start;