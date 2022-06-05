class AppEvents {
  parent: AppClass;

  constructor(parent: AppClass) {
    this.parent = parent;
  }

  OnGenerate() {
    const { methods } = this.parent;
    methods.Generate();
  }

  OnCountXChanged(e: Event) {
    const { methods } = this.parent;
    if (e.target === null) return;
    const reg = /\d*/g.exec(e.target['value']);
    if (reg === null || !reg[0])
      methods.SetCountX(undefined);
    else
      methods.SetCountX(+reg[0]);
  };

  OnCountYChanged(e: Event) {
    const { methods } = this.parent;
    if (e.target === null) return;
    const reg = /\d*/g.exec(e.target['value']);
    if (reg === null || !reg[0])
      methods.SetCountY(undefined);
    else
      methods.SetCountY(+reg[0]);
  };

  OnScaleWheel(e: WheelEvent) {
    if (e.deltaY)
      this.OnScaleDown()
    else
      this.OnScaleUp();
  }

  OnScaleChanged(e: Event) {
    const { methods } = this.parent;
    if (e.target === null) return;
    const reg = /[0-9\.]*/g.exec(e.target['value']);
    if (reg === null || !reg[0])
      methods.SetScale(undefined);
    else
      methods.SetScale(+reg[0] * 0.01);
  }

  OnScaleUp() {
    const { methods } = this.parent;
    methods.SetScale(this.parent.settings.scale / this.parent.settings.scaleStep);
  }

  OnScaleDown() {
    const { methods } = this.parent;
    methods.SetScale(this.parent.settings.scale * this.parent.settings.scaleStep);
  }

  OnScaleReset() {
    const { methods, defaultSettings } = this.parent;
    methods.SetScale(defaultSettings.scale);
  }

  OnMovingDown(e: MouseEvent) {
    if (e.target !== this.parent.elements.mainObject) return;
    if (e.button !== 0) return;
    const { mouse } = this.parent.state;
    mouse.start.x = e.screenX;
    mouse.start.y = e.screenY;
    mouse.current.x = mouse.start.x;
    mouse.current.y = mouse.start.y;
    mouse.isDown = true;
  }

  OnMovingMove(e: MouseEvent) {
    const { mouse, offset } = this.parent.state;
    if (!mouse.isDown) return;
    mouse.current.x = e.screenX;
    mouse.current.y = e.screenY;
    const { x, y } = mouse.start;
    const dx = mouse.current.x - x;
    const dy = mouse.current.y - y;
    Var('offset-x', `${offset.x + dx}px`);
    Var('offset-y', `${offset.y + dy}px`);
  }

  OnMovingUp(e: MouseEvent) {
    const { methods } = this.parent;
    const { mouse, offset } = this.parent.state;
    if (e.button !== 0) return;
    if (!mouse.isDown) return;
    mouse.isDown = false;
    methods.SetOffset(
      offset.x + mouse.current.x - mouse.start.x,
      offset.y + mouse.current.y - mouse.start.y,
    );
  }

  OnMovingReset() {
    const { methods } = this.parent;
    methods.SetOffset(0, 0);
  }

  OnCellClick(arrowElement: ArrowElement, e: Event) {
    arrowElement.RotateRight();
  }

  OnCellContext(arrowElement: ArrowElement, e: Event) {
    e.preventDefault();
    arrowElement.RotateLeft();
  }
}
