App.CreateArrowElement = () => {
  const span = App.Create('span');
  const arrowSpan = App.Create('span');
  const numberSpan = App.Create('span');
  span.className = 'arrow';
  arrowSpan.className = 'arrow__icon';
  numberSpan.className = 'arrow__number';
  span.appendChild(arrowSpan);
  arrowSpan.appendChild(numberSpan);

  return {
    span: span,
    arrow: arrowSpan,
    number: numberSpan,
    direction: 0,
    index: 0,
    count: 0,
  };
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
      App.SetGridElement(element, {index});
      grid[y][x] = element;
    }
  }

  return grid;
};