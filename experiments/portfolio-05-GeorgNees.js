function setup() {
  createCanvas(innerWidth, innerHeight);
  noLoop();
}

// size of each ellipse
const size = 60;
// how many circles across (columns) and down (rows)
const cols = 14;
const rows = 7;

function drawLinesInCircle(cx, cy, d, count) {
  const r = d / 2;

  // To draw the ellipse outlines
  // stroke(0, 0, 0);
  // strokeWeight(0.2);
  // noFill();
  // ellipse(cx, cy, d, d);

  // line style
  stroke(255, 0, 0);
  strokeWeight(0.2);
  noFill();

  // the following 40 lines of code were written with the help of ChatGPT
  for (let i = 0; i < count; i++) {
    // random line direction
    const theta = random(TWO_PI);
    // offset to make the lines random
    const offset = random(-r * 0.85, r * 0.85);
    // otherwise they go through the center
    // const offset = 1;

    // pick a unit direction vector for the line (angle = theta)
    // x-component of direction
    const dx = cos(theta);

    // y-component of direction
    const dy = sin(theta);

    // find a perpendicular (normal) vector to (dx, dy)
    // this is used to shift the line away from the center
    const nx = -dy;
    const ny = dx;

    // calculate the line midpoint (mx, my)
    // start from circle center (cx, cy), then shift along the normal
    // "offset" is how far from the center the line is placed
    const mx = cx + nx * offset;
    const my = cy + ny * offset;

    // work out half the line length so that the endpoints lie on the circle boundary
    // (Pythagoras: if offset = distance from center, then half-length = √(r² - offset²))
    const L = sqrt(r * r - offset * offset);

    // calculate the two endpoints of the line
    // go L units forward and backward along the direction vector (dx, dy)
    // starting from the midpoint (mx, my)
    const x1 = mx - dx * L;
    const y1 = my - dy * L;
    const x2 = mx + dx * L;
    const y2 = my + dy * L;

    // finally, draw the line
    line(x1, y1, x2, y2);
  }
}

function draw() {
  background(0, 0, 0);

  // total grid size
  const gridWidth = cols * size;
  const gridHeight = rows * size;

  // center the grid (these are the centers of the first cell)
  const startX = (width - gridWidth) / 2 + size / 2;
  const startY = (height - gridHeight) / 2 + size / 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // the following 25 lines of code were written with the help of ChatGPT
      // calculate the x-position of this circle’s center
      // startX = the center of the first circle in the row
      // x * size = move right by one "cell width" for each column
      const cx = startX + x * size;

      // calculate the y-position of this circle’s center
      // startY = the center of the first circle in the grid
      // y * size = move down by one "cell height" for each row
      const cy = startY + y * size;

      // decide how many lines to draw inside this circle
      // formula explanation:
      //   y * cols -> counts how many cells are in the full rows above
      //   + x -> adds the index of the current cell in the current row
      //   (y * cols + x) -> gives the cell’s position in the grid (starting at 0)
      //   * step -> multiplies by how many extra lines we want to add per cell
      //   + 1 -> makes the very first cell start with 1 line instead of 0

      const step = 2;
      const n = 1 + (y * cols + x) * step;

      // draw the circle at (cx, cy), with diameter = size,
      // and place n lines inside it
      drawLinesInCircle(cx, cy, size, n);
    }
  }
}
