const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const DIRECTIONS = {
  'ArrowLeft': 'Left',
  'ArrowRight': 'Right',
  'ArrowUp': 'Up',
  'ArrowDown': 'Down',
};

function init() {
  const canvas = document.getElementById('root');
  const context = canvas.getContext("2d");
  const board = {
    width: Math.floor(canvas.width / Pixel.SIZE),
    height: Math.floor(canvas.height / Pixel.SIZE),
  };
  const snake = new Snake(centerPixel());
  let candy = randomPixel();

  function centerPixel() {
    return new Pixel(board.width/2, board.height/2);
  }

  function randomPixel() {
    const x = Math.floor(Math.random() * board.width);
    const y = Math.floor(Math.random() * board.height)
    return new Pixel(x, y);
  }

  function nextTick() {
    if (update()) {
      render(context);
    }
    else {
      clearInterval(interval);
      alert(`Game finished with ${snake.lives()} live(s)`);
    }
  }

  function update() {
    const moved = snake.move();
    const insideBoard = snake.head().inside(0, 0, board.width, board.height);
    if (!moved || !insideBoard) {
      return false;
    }
    if (snake.contains(candy)) {
      snake.eat();
      candy = randomPixel();
    }
    return true;
  }

  function render(context) {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    candy.render(context);
    snake.render(context);
  }

  function onKeyDown(event) {
    if (!DIRECTIONS[event.key]) return;
    event.preventDefault();
    snake.direction = DIRECTIONS[event.key] || snake.direction;
  }

  window.addEventListener("keydown", onKeyDown);
  const interval = setInterval(nextTick, 100.0);
}

class Pixel {
  static get SIZE() {
    return 5;
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(other) {
    return this.x == other.x && this.y == other.y;
  }

  inside(x, y, width, height) {
    return this.x >= x && this.x < x + width && this.y >= y && this.y < y + height
  }

  render(context, color = 'green') {
    context.fillStyle = color;
    context.fillRect(this.x * Pixel.SIZE, this.y * Pixel.SIZE, Pixel.SIZE - 1, Pixel.SIZE - 1);
  }
}

class Snake {
  constructor(pixel) {
    this.body = [pixel];
    this.direction = 'Right';
  }

  head() {
    return this.body[0];
  }

  eat() {
    this.body.unshift(this.head());
  }

  nextPixel() {
    const head = this.head();
    switch (this.direction) {
      case 'Up': return new Pixel(head.x, head.y - 1);
      case 'Down': return new Pixel(head.x, head.y + 1);
      case 'Left': return new Pixel(head.x - 1, head.y);
      case 'Right': return new Pixel(head.x + 1, head.y);
    }
  }

  move() {
    const nextPixel = this.nextPixel();
    if (this.contains(nextPixel)) return false;
    this.body.pop();
    this.body.unshift(nextPixel);
    return true;
  }

  lives() {
    return this.body.length;
  }

  contains(pixel) {
    return this.body.some(p => p.equals(pixel))
  }

  render(context) {
    this.body.forEach(pixel => pixel.render(context, 'blue'));
  }
}
