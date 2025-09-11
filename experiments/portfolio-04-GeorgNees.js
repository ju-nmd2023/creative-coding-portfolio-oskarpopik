function setup() {
  createCanvas(innerWidth, innerHeight);
  noLoop();
}

// size of each ellipse
const size = 60;
// how many circles across (columns) and down (rows)
const cols = 14;
const rows = 7;

function drawCircleWithShade(cx, cy, d) {
  // Red value: from dark (25) to bright (255)
  const r = random(25, 255);

  // Green and Blue tints
  const g = random(0, 10);
  const b = random(0, 10);

  noStroke();
  fill(r, g, b);
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

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = startX + x * size;
      const cy = startY + y * size;
      drawCircleWithShade(cx, cy, size);
    }
  }
}
