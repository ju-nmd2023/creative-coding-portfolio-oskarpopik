// The initial code structure was taken form an lecture example by Garrit Schaap: https://codepen.io/pixelkind/pen/OJrMeaj

// size of each grid cell (outer "tile")
const size = 30;

// space between tiles
const gap = 20;

// how many tiles in each direction (so total grid is amount × amount)
const amount = 10;

function setup() {
  createCanvas(innerWidth, innerHeight);
}

function drawElement() {
  // Braille cell: 2 columns x 3 rows
  const cols = 2;
  const rows = 3;

  // cell subdivision sizes
  const sx = size / cols;
  const sy = size / rows;

  push();
  noStroke();

  // loop through Braille positions
  for (let cx = 0; cx < cols; cx++) {
    for (let ry = 0; ry < rows; ry++) {
      // center of each Braille dot position
      const px = (cx + 0.5) * sx;
      const py = (ry + 0.5) * sy;

      // chance to draw this dot
      if (Math.random() < 0.3) {
        fill(0, 0, 0);
        // dot diameter based on row height (sy)
        const dotD = sy * 0.6;
        ellipse(px, py, dotD, dotD);
      }
    }
  }
  pop();
}

function draw() {
  background(255, 255, 255);

  noFill();
  stroke(0, 0, 0);
  strokeWeight(1);

  // calculate the center starting point so grid is centered on canvas
  const centerX = (width - size) / 2;
  const centerY = (height - size) / 2;

  // loop over grid positions: x and y go from -amount/2 to +amount/2
  for (let x = -Math.floor(amount / 2); x < Math.ceil(amount / 2); x++) {
    for (let y = -Math.floor(amount / 2); y < Math.ceil(amount / 2); y++) {
      // position of current tile
      let xPosition = centerX + x * (size + gap);
      let yPosition = centerY + y * (size + gap);

      // if amount is even, shift by half a tile to keep perfect centering
      if (amount % 2 === 0) {
        xPosition += size / 2;
      }

      // move drawing origin to this tile’s position
      push();
      translate(xPosition, yPosition);

      // draw the randomized inner ellipses
      drawElement(0);

      pop();
    }
  }

  noLoop();
}
