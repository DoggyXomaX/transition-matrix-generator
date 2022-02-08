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