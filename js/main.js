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

/* Graphics */
App.CreateArrowBox = (count, size, border, padding, useCenter) => {
  const canvas = App.Create('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  // clear
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw border 10%
  ctx.strokeStyle = 'black';
  ctx.lineWidth = (size * border) * 2;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();
  
  if (count === 0) return canvas;

  // draw arrows
  ctx.fillStyle = 'black';
  const offset = size * (border + padding);
  const arrowSize = size - offset * 2;
  const arrowWidth = arrowSize / count;
  for (let i = 0; i < count; i++) {
    const px = offset + arrowWidth * i;
    const py = size * 0.5;
    ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + arrowWidth, py - arrowSize * 0.5);
      if (useCenter) ctx.lineTo(px + arrowWidth * 0.5, py);
      ctx.lineTo(px + arrowWidth, py + arrowSize * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  return canvas;
};
App.CreateNumberedArrowBox = (count, size, border, padding) => {
  const canvas = App.Create('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  // clear
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw border 10%
  ctx.strokeStyle = 'black';
  ctx.lineWidth = (size * border) * 2;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();
  // draw arrow
  const offset = size * (border + padding);
  ctx.fillStyle = 'black';
  ctx.beginPath();
    ctx.moveTo(offset, size * 0.5);
    ctx.lineTo(size - offset, offset);
    ctx.lineTo(size - offset, size - offset);
  ctx.closePath();
  ctx.fill();
  // draw text
  ctx.fillStyle = 'white';
  ctx.font = "bold 24px monospace";
  const fontMeasure = ctx.measureText(count);
  const fontSize = {
    width: fontMeasure.actualBoundingBoxRight + fontMeasure.actualBoundingBoxLeft,
    height: fontMeasure.actualBoundingBoxAscent + fontMeasure.actualBoundingBoxDescent,
  };
  ctx.fillText(count, (size - fontSize.width) * 0.7, (size + fontSize.height) * 0.5);

  return canvas;
};

/* Shortcuts */
App.Tag = (tag) => document.getElementsByTagName(tag);
App.Get = (id) => document.getElementById(id);
App.Var = (name, value) => document.documentElement.style.setProperty(`--${name}`, value);
App.Create = (tag) => document.createElement(tag);

/* Init */
App.Start = () => {
  App.elements = App.GetElements();
  App.PrepareElements();

  // test
  const canvas = App.CreateNumberedArrowBox(24, 100, 0.05, 0.05);
  App.elements.articleObject.appendChild(canvas);
};

window.onload = App.Start;