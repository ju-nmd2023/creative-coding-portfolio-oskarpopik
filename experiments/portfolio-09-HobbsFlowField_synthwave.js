// Uses Tone.js for audio

// Inspired by Tyler Hobbs' flow field article, adapted for p5.js
// https://www.tylerxhobbs.com/words/flow-fields

// Parameters
// size of each grid cell (smaller means more detail)
let cellSize = 20;
// how much the field rotates (1.0 - 8.0)
let angleMult = 0;
// how fast the field changes over time
let zSpeed;
// how many moving points to draw
let numParticles = 10000;
// drawing thickness for trails
let lineThickness = 0.5;
// max speed of each particle
let particleSpeed = 20;
// background color (RGB)
let bgColor = [0, 0, 64];

// stroke color (RGBA)
let strokeColor = [243, 156, 18, 20];
// second stroke color (RGBA)
let strokeColor2 = [231, 76, 60, 60];

// amount of frames after which the draw stops (50s at 60fps)
// let maxFrames = 3000;

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

let color1;
let color2;

let synth;
let loop;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Set drawing styles with variables
  background(bgColor);
  blendMode(ADD);
  stroke(strokeColor);
  strokeWeight(lineThickness);
  noFill();

  color1 = color(strokeColor); // blue
  color2 = color(strokeColor2); // red

  // Prepare the flow field grid and the particles
  initField();
  for (let i = 0; i < numParticles; i++) {
    particles.push(createParticle());
  }

  // The process of improvemeng of the Tone.js lines below was done with the help of ChatGPT
  // ===== TONE.JS =====
  {
    // Instruments
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.3, decay: 0.6, sustain: 0.4, release: 3 },
    }).toDestination();

    const arpSynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0.0, release: 0.15 },
    }).toDestination();

    // Tempo
    Tone.Transport.bpm.value = 124;

    // Chords (lower register)
    const progression = [
      ["D2", "A2", "D3"],
      ["G2", "D3", "G3"],
      ["C3", "G3", "Bb3"],
      ["F2", "C3", "F3"],
    ];
    let chordIndex = 0;

    // PAD: one chord per bar
    new Tone.Loop((time) => {
      const chord = progression[chordIndex % progression.length];
      synth.triggerAttackRelease(chord, "1m", time, 0.25);
      chordIndex++;
    }, "1m").start(0);

    // ARP: steady 8th-notes over current chord
    const arpPick = [0, 1, 2, 1];
    let arpStep = 0;

    new Tone.Loop((time) => {
      const chord =
        progression[(chordIndex - 1 + progression.length) % progression.length];
      const note = chord[arpPick[arpStep % arpPick.length]];
      arpSynth.triggerAttackRelease(note, "8n", time, 0.35);
      arpStep++;
    }, "8n").start(0);

    // Start; resume audio context in your mousePressed()
    Tone.Transport.start();
  }
  // ===== /TONE.JS =====
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
  // Make it static after some time
  // if (frameCount > maxFrames) noLoop();

  // the following 18 lines of code were written with the help of ChatGPT
  // calculate the flow field directions for this frame
  let yOffset = 0;
  for (let y = 0; y < rows; y++) {
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      // Turn Perlin noise into an angle, then into a direction vector
      const angle = noise(xOffset, yOffset, zOffset) * TWO_PI * angleMult;
      const dir = p5.Vector.fromAngle(angle).setMag(1);
      field[indexFor(x, y)] = dir;
      xOffset += 0.1;
    }
    yOffset += 0.1;
  }
  zOffset += zSpeed;

  // Move and draw each particle
  for (const p of particles) {
    step(p, field);
  }
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

  // each particle gets a fixed color (50/50 split)
  const colors = random([color1, color2]);

  return { pos, prev, vel, acc, maxSpeed, colors };
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
  stroke(p.colors);
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

// Start the sound when you click anywhere on the canvas
function mousePressed() {
  if (Tone.context.state !== "running") {
    Tone.context.resume();
  }
}
