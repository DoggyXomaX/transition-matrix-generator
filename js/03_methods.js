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
App.Generate = () => {
  const { gridElementSize, countX, countY } = App.settings;
  const { articleObject } = App.elements;
  App.state.grid = App.CreateGrid({
    gridElementSize, countX, countY,
    articleObject,
  });
};
