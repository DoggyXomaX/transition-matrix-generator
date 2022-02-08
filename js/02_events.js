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
