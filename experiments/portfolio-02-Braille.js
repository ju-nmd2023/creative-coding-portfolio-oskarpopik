// The initial code structure was taken form an lecture example by Garrit Schaap: https://codepen.io/pixelkind/pen/OJrMeaj

// size of each grid cell (outer "tile")
const size = 30;

// space between tiles
const gap = 20;

// how many tiles in each direction
const amount = 10;

// how many tiles to reveal per frame
const SPEED = 1;

// array to hold all tile positions (x,y)
let tiles = [];

// keeps track of how many tiles are revealed so far
let revealCount = 0;

function setup() {
  // create canvas the size of the window
  createCanvas(innerWidth, innerHeight);

  // control how fast draw() runs (FPS)
  frameRate(5);

  // the following 19 lines of code were generated with the help of ChatGPT
  // calculate the grid’s horizontal center offset
  const centerX = (width - size) / 2;
  // calculate the grid’s vertical center offset
  const centerY = (height - size) / 2;

  // loop through rows (gy = grid y position)
  for (let gy = -Math.floor(amount / 2); gy < Math.ceil(amount / 2); gy++) {
    // loop through columns (gx = grid x position)
    for (let gx = -Math.floor(amount / 2); gx < Math.ceil(amount / 2); gx++) {
      // compute x position of current tile
      let xPosition = centerX + gx * (size + gap);
      // compute y position of current tile
      let yPosition = centerY + gy * (size + gap);

      // shift for even grid sizes to keep centering correct
      if (amount % 2 === 0) xPosition += size / 2;

      // save this tile position into the tiles array
      tiles.push({ x: xPosition, y: yPosition });
    }
  }
}

function drawElement(seed) {
  // Braille cell: 2 columns x 3 rows
  const cols = 2;
  const rows = 3;

  // cell subdivision sizes
  const sx = size / cols;
  const sy = size / rows;

  // the use of the randomSeed function was suggested with the help of ChatGPT
  // set a random seed based on tile index
  // ensures the dots in each tile look the same every frame
  randomSeed(seed);

  // no outlines for the dots
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
}

function draw() {
  // clear background to white
  background(255);

  // set style for possible outlines (not used here but kept for consistency)
  noFill();
  stroke(0);
  strokeWeight(1);

  // the following 24 lines of code were generated with the help of ChatGPT
  // determine how many tiles to draw so far (from 0 up to revealCount)
  const N = min(revealCount, tiles.length);

  // loop through the tiles that should already be revealed
  for (let i = 0; i < N; i++) {
    // get tile coordinates from array
    const { x, y } = tiles[i];

    // move drawing origin to tile center
    push();
    translate(x, y);

    // draw a tile with stable randomness (seed = index + offset)
    drawElement(i + 1000);

    pop();
  }

  // increase number of revealed tiles until all are shown
  if (revealCount < tiles.length) {
    revealCount += SPEED;
  } else {
    // stop looping once all tiles are revealed
    noLoop();
  }
}
