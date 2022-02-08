App.Trace = async (countX, countY) => {
  const map = new Array(countX * countY);
  let count = 1;
  let currentNode = {
    prev: null,
    x: Math.random() * countX >> 0,
    y: Math.random() * countY >> 0,
    targets: null,
    targetIndex: null,
  };

  const FindEmptyCells = (x, y) => {
    const arr = new Array(countX + countY - 2);
    let p = 0;

    for (let i = 0; i < countX; i++)
      if (i !== x && !map[y * countX + i])
        arr[p++] = {x: i, y};
    for (let i = 0; i < countY; i++)
      if (i !== y && !map[i * countX + x])
        arr[p++] = {x, y: i};

    arr.length = p;
    return arr;
  };

  for (let i = 0, k = countX * countY; i < k; i++) map[i] = false;
  currentNode.targets = FindEmptyCells(currentNode.x, currentNode.y);
  map[currentNode.y * countX + currentNode.x] = true;

  while (count != countX * countY) {
    if (currentNode.targets.length === 0) {
      count--;
      map[currentNode.y * countX + currentNode.x] = false;
      currentNode = currentNode.prev;
      currentNode.targets.splice(currentNode.targetIndex, 1);
    } else {
      currentNode.targetIndex = Math.random() * currentNode.targets.length >> 0;
      const pos = currentNode.targets[currentNode.targetIndex];
      const newNode = {
        prev: currentNode,
        x: pos.x,
        y: pos.y,
        targets: FindEmptyCells(pos.x, pos.y),
        targetIndex: null,
      };
      currentNode = newNode;
      map[pos.y * countX + pos.x] = true;
      count++;
    }
  }

  const grid = new Array(count);
  let index = count - 1;
  let direction = 0;
  count = 0;
  grid[currentNode.y * countX + currentNode.x] = { index, direction, count };

  while (index--) {
    const posX = currentNode.x;
    const posY = currentNode.y;
    
    currentNode = currentNode.prev;
    const prevX = currentNode.x;
    const prevY = currentNode.y;
    
    const dx = posX - prevX;
    const dy = posY - prevY;
    
    if (dx > 0) direction = 2;
    else if (dy < 0) direction = 1;
    else if (dy > 0) direction = 3;
    else direction = 0;
    count = Math.abs(dx + dy);

    grid[prevY * countX + prevX] = { index, direction, count };
  }

  return grid;
};
