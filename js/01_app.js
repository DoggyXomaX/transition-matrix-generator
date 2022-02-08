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
  