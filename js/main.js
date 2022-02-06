const App = {
  elements: null,
  state: {
    width: 5,
    height: 5,
    scale: 1,
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
  App.elements.mainObject.addEventListener('mousewheel', App.OnScaleWheel, true);
  App.SetScale(App.state.scale);
};
App.SetScale = (value) => {
  if (!value) value = App.state.scale;
  App.state.scale = value;
  App.elements.scaleInput.value = `${(value * 100).toFixed(2)}%`;
  App.Var('scale', value);
};
App.SetOffset = (x, y) => {
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