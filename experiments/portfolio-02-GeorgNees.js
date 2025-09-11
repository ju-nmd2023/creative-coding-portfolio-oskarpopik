function setup() {
  createCanvas(innerWidth, innerHeight);
  noLoop();
}

// size of each ellipse
const size = 60;
// how many circles across (columns) and down (rows)
const cols = 14;
const rows = 7;

function drawCircle(x, y) {
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();

  // draw circle centered on (x, y)
  ellipseMode(CENTER);
  ellipse(x, y, size, size);
}

function draw() {
  background(0);

  // total grid size
  const gridWidth = cols * size;
  const gridHeight = rows * size;

  // center the grid (these are the centers of the first cell)
  const startX = (width - gridWidth) / 2 + size / 2;
  const startY = (height - gridHeight) / 2 + size / 2;

  // loop through rows and columns to place circles in a grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = startX + x * size;
      const cy = startY + y * size;

      drawCircle(cx, cy);
    }
  }
}
