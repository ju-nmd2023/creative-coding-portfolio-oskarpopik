// Inspired by Tyler Hobbs' flow field article, adapted for p5.js
// https://www.tylerxhobbs.com/words/flow-fields

// Parameters
// size of each grid cell (smaller means more detail)
let cellSize = 10;
// how much the field rotates (1.0 - 8.0)
let angleMult = 1.0;
// how many moving points to draw
let numParticles = 10000;
// drawing thickness for trails
let lineThickness = 1;
// max speed of each particle
let particleSpeed = 2;
// background color (RGB)
let bgColor = [29, 1, 59];
// stroke color (RGBA)
let strokeColor = [255, 1, 91, 30];
// how long the trails should be (iterations)
let steps = 100;

// Variables
// number of columns in the grid
let cols;
// number of rows in the grid
let rows;
// 1D array holding unit direction vectors
let field;
// noise z-dimension offset (time)
let zOffset = 0;
// array of Particle objects
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Set drawing styles with variables
  background(bgColor);
  stroke(strokeColor);
  strokeWeight(lineThickness);
  noFill();

  // the following 19 lines of code were written with the help of ChatGPT
  // Prepare the flow field grid and the particles
  initField();
  for (let i = 0; i < numParticles; i++) {
    particles.push(createParticle());
  }
}

// Build (or rebuild) the flow field grid based on the canvas size
function initField() {
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  field = new Array(cols * rows);
}

// Convert (x,y) cell coords to a valid index into the 1D field array
function indexFor(x, y) {
  x = constrain(x, 0, cols - 1);
  y = constrain(y, 0, rows - 1);
  return x + y * cols;
}

function draw() {
  // the following 18 lines of code were written with the help of ChatGPT
  // calculate the flow field directions once (static)
  let yOffset = 0;
  for (let y = 0; y < rows; y++) {
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      const angle = noise(xOffset, yOffset, zOffset) * TWO_PI * angleMult;
      const dir = p5.Vector.fromAngle(angle).setMag(1);
      field[indexFor(x, y)] = dir;
      xOffset += 0.1;
    }
    yOffset += 0.1;
  }

  // Draw a static image by stepping particles multiple times in one frame
  for (let i = 0; i < steps; i++) {
    for (const p of particles) {
      step(p, field);
    }
  }
  // stop after rendering the static image
  noLoop();
}

// Create one particle object with the fields we need
function createParticle() {
  // current position (x, y) in pixels
  const pos = createVector(random(width), random(height));

  // previous position (used to draw the trail segment)
  const prev = pos.copy();

  // current velocity vector
  const vel = createVector(0, 0);

  // accumulated force (reset each frame)
  const acc = createVector(0, 0);

  // maximum speed (pixels per frame)
  const maxSpeed = particleSpeed;

  return { pos, prev, vel, acc, maxSpeed };
}

// Add the flow vector at the particle's current cell as a force
function follow(p, vectors) {
  const cx = floor(p.pos.x / cellSize);
  const cy = floor(p.pos.y / cellSize);
  const force = vectors[indexFor(cx, cy)];
  if (force) applyForce(p, force);
}

// Apply a small force to the particle
function applyForce(p, force) {
  p.acc.add(force);
}

// Standard Euler integration step
function update(p) {
  p.vel.add(p.acc);
  p.vel.limit(p.maxSpeed);
  p.pos.add(p.vel);
  p.acc.mult(0);
}

// Wrap around the canvas edges and keep the trail continuous
function edges(p) {
  let wrapped = false;
  if (p.pos.x > width) {
    p.pos.x = 0;
    wrapped = true;
  }
  if (p.pos.x < 0) {
    p.pos.x = width;
    wrapped = true;
  }
  if (p.pos.y > height) {
    p.pos.y = 0;
    wrapped = true;
  }
  if (p.pos.y < 0) {
    p.pos.y = height;
    wrapped = true;
  }
  if (wrapped) p.prev.set(p.pos);
}

// Draw a short line from the last position to the current one
function drawParticle(p) {
  line(p.pos.x, p.pos.y, p.prev.x, p.prev.y);
  p.prev.set(p.pos);
}

// Do one frame for this particle: sample field - move - wrap - draw
function step(p, flowField) {
  follow(p, flowField);
  update(p);
  edges(p);
  drawParticle(p);
}
