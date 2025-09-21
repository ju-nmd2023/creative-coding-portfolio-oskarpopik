function setup() {
  createCanvas(innerWidth, innerHeight);
  noLoop();
}

// size of each ellipse
const size = 60;
// how many circles across (columns) and down (rows)
const cols = 14;
const rows = 7;

function drawCircleWithAlpha(cx, cy, d, alpha) {
  // draw a filled red circle with transparency = alpha (0..255)
  noStroke();
  fill(255, 0, 0, alpha);
  ellipse(cx, cy, d, d);
}

function draw() {
  background(0);

  // total grid size
  const gridWidth = cols * size;
  const gridHeight = rows * size;

  // center the grid (these are the centers of the first cell)
  const startX = (width - gridWidth) / 2 + size / 2;
  const startY = (height - gridHeight) / 2 + size / 2;

  // how many cells total (for mapping the alpha)
  const total = rows * cols;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = startX + x * size;
      const cy = startY + y * size;

      // The following 5 lines of code were written with the help of ChatGPT

      // gives each ellipse a unique number, scanning across the grid (linear index across rows)
      const index = y * cols + x;

      // turns index into an alpha value between 0 and 255, so transparency gradually increases
      const alpha = map(index, 0, total - 1, 0, 255);

      drawCircleWithAlpha(cx, cy, size, alpha);
    }
  }
}
