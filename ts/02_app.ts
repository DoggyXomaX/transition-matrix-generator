class AppElements {
  generateButton: HTMLButtonElement;

  countXInput: HTMLInputElement | null = null;
  countYInput: HTMLInputElement | null = null;

  scaleInput: HTMLInputElement | null = null;
  scaleUpButton: HTMLButtonElement | null = null;
  scaleDownButton: HTMLButtonElement | null = null;
  scaleResetButton: HTMLButtonElement | null = null;
  offsetResetButton: HTMLButtonElement | null = null;

  articleObject: HTMLElement | null = null;

  mainObject: HTMLElement | null = null;
}

class AppMouseState {
  isDown: boolean = false;
  start: Vector2 = new Vector2(0, 0);
  current: Vector2 = new Vector2(0, 0);
}

class AppSettings {
  countX: number = 5;
  countY: number = 5;
  scale: number = 2;
  scaleStep: number = 0.8;
  gridElementSize: number = 30;

  constructor(countX: number, countY: number, scale: number, scaleStep: number, gridElementSize: number) {
    this.countX = countX;
    this.countY = countY;
    this.scale = scale;
    this.scaleStep = scaleStep;
    this.gridElementSize = gridElementSize;
  }
}

class AppState {
  offset = new Vector2(0, 0);
  mouse = new AppMouseState();
  grid: any;
}

class AppClass {
  elements = new AppElements();
  state = new AppState();
  defaultSettings = new AppSettings(5, 5, 2, 0.8, 30);
  settings = new AppSettings(
    this.defaultSettings.countX,
    this.defaultSettings.countY,
    this.defaultSettings.scale,
    this.defaultSettings.scaleStep,
    this.defaultSettings.gridElementSize
  );

  events = new AppEvents(this);
  methods = new AppMethods(this);
  graphics = new AppGraphics(this);
  tracer = new AppTracer(this);

  GetElements(): AppElements {
    const tags = [
      ...Tag('input'),
      ...Tag('button'),
      ...Tag('article'),
      ...Tag('main'),
    ];
    const elements = {};
    tags.forEach(e => elements[e.id] = e);
    return elements as AppElements;
  }

  PrepareElements() {
    const {
      generateButton,
      countXInput, countYInput,
      scaleInput, scaleUpButton, scaleDownButton, scaleResetButton, offsetResetButton,
      mainObject,
    } = this.elements;

    const parent: AppClass = this;

    generateButton?.addEventListener('click', () => parent.events.OnGenerate());

    countXInput?.addEventListener('change', (e) => parent.events.OnCountXChanged(e), true);
    countYInput?.addEventListener('change', (e) => parent.events.OnCountYChanged(e), true);

    scaleInput?.addEventListener('change', (e) => parent.events.OnScaleChanged(e), true);
    scaleUpButton?.addEventListener('click', (e) => parent.events.OnScaleUp());
    scaleDownButton?.addEventListener('click', (e) => parent.events.OnScaleDown());
    scaleResetButton?.addEventListener('click', (e) => parent.events.OnScaleReset());
    offsetResetButton?.addEventListener('click', (e) => parent.events.OnMovingReset());

    mainObject?.addEventListener('wheel', (e) => parent.events.OnScaleWheel(e), true);
    mainObject?.addEventListener('mousedown', (e) => parent.events.OnMovingDown(e), true);
    mainObject?.addEventListener('mousemove', (e) => parent.events.OnMovingMove(e), true);
    window.addEventListener('mouseup', (e) => parent.events.OnMovingUp(e), true);

    const { methods, settings } = this;
    methods.SetScale(settings.scale);
    methods.Generate();
  };

  Start() {
    this.elements = this.GetElements();
    this.PrepareElements();
  }
}
