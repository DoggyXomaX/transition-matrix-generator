const App = {
  elements: null,
  state: {
    width: 5,
    height: 5,
    scale: 1,
    offset: {
      x: 0,
      y: 0,
    },
    mouse: {
      isDown: false,
      start: {
        x: 0,
        y: 0,
      },
      current: {
        x: 0,
        y: 0,
      },
    },
  },
  settings: {
    scaleStep: 0.8,
  },
};

/* Events */
App.OnScaleWheel = (e) => (e.deltaY > 0 ? App.OnScaleDown : App.OnScaleUp)();
App.OnScaleChanged = (e) => {
  const reg = /[0-9\.]*/g.exec(e.target.value);
  App.SetScale(reg[0] ? +reg[0] * 0.01 : undefined);
};
App.OnScaleUp = () => App.SetScale(App.state.scale / App.settings.scaleStep);
App.OnScaleDown = () => App.SetScale(App.state.scale * App.settings.scaleStep);
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
  if (!value) value = App.state.scale;
  App.state.scale = value;
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

/* Shortcuts */
App.Tag = (tag) => document.getElementsByTagName(tag);
App.Get = (id) => document.getElementById(id);
App.Var = (name, value) => document.documentElement.style.setProperty(`--${name}`, value);

/* Init */
App.Start = () => {
  App.elements = App.GetElements();
  App.PrepareElements();
};

window.onload = App.Start;