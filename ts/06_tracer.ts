class TraceNode {
  prev: TraceNode;
  x: number;
  y: number;
  targets: Vector2[];
  targetIndex: number;
  constructor(x?: number, y?: number) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
  }
}

class AppTracer {
  parent: AppClass;

  constructor(parent: AppClass) {
    this.parent = parent;
  }

  async Trace(countX: number, countY: number): Promise<ArrowElementOptions[]> {
    const map = new Array<boolean>(countX * countY);
    let currentNode = new TraceNode(
      Math.random() * countX >> 0,
      Math.random() * countY >> 0
    );

    const FindEmptyCells = (x: number, y: number): Vector2[] => {
      const arr = new Array<Vector2>(countX + countY - 2);
      let p = 0;

      for (let i = 0; i < countX; i++)
        if (i !== x && !map[y * countX + i])
          arr[p++] = new Vector2(i, y);

      for (let i = 0; i < countY; i++)
        if (i !== y && !map[i * countX + x])
          arr[p++] = new Vector2(x, i);

      arr.length = p;
      return arr;
    };

    const mapLength = countX * countY;
    for (let i = 0; i < mapLength; i++) map[i] = false;
    currentNode.targets = FindEmptyCells(currentNode.x, currentNode.y);
    map[currentNode.y * countX + currentNode.x] = true;

    let count = 1;
    for (; count != mapLength;) {
      if (currentNode.targets.length === 0) {
        count--;
        map[currentNode.y * countX + currentNode.x] = false;
        currentNode = currentNode.prev;
        currentNode.targets.splice(currentNode.targetIndex, 1);
      } else {
        currentNode.targetIndex = Math.random() * currentNode.targets.length >> 0;
        const pos = currentNode.targets[currentNode.targetIndex];

        const newNode = new TraceNode(pos.x, pos.y);
        newNode.prev = currentNode;
        newNode.targets = FindEmptyCells(pos.x, pos.y);
        newNode.targetIndex = -1;
        currentNode = newNode;

        map[pos.y * countX + pos.x] = true;
        count++;
      }
    }

    const grid = new Array<ArrowElementOptions>(count);
    let index = count - 1;
    grid[currentNode.y * countX + currentNode.x] = new ArrowElementOptions(
      ArrowDirection.Left,
      count,
      index
    );

    let arrowCount = 0;
    let direction = 0;
    while (index--) {
      const posX = currentNode.x;
      const posY = currentNode.y;

      currentNode = currentNode.prev;
      const prevX = currentNode.x;
      const prevY = currentNode.y;

      const dx = posX - prevX;
      const dy = posY - prevY;

      if (dx > 0)
        direction = ArrowDirection.Right;
      else if (dy < 0)
        direction = ArrowDirection.Up;
      else if (dy > 0)
        direction = ArrowDirection.Down;
      else
        direction = ArrowDirection.Left;
      arrowCount = Math.abs(dx + dy);

      grid[prevY * countX + prevX] = new ArrowElementOptions(direction, arrowCount, index);
    }

    return grid;
  }
}
