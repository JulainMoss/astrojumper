let particles = [];
let springs = [];

const radius = 10;
const stiffness = 50;
const length = 50;
const qq = 67500;
let damping = 13.0;

const dt = 1 / 60;


let selected = null;
let dx = 0;
let dy = 0;

N = 100;
L = 10;

class Particle {
  constructor(x, y, m = 1.0) {
    this.r = createVector(x, y);
    this.v = createVector(0, 0);
    this.a = createVector(0, 0);
    this.m = m;
  }

  update() {
    this.v.add(p5.Vector.mult(this.a,dt));
    this.r.add(p5.Vector.mult(this.v, dt));
    this.a.mult(0);
  }

  draw() {
    circle(this.r.x, this.r.y, radius*2);
  }
}


function setup() {
  createCanvas(600, 600);

  dampingSlider = document.getElementById("damping");
  button = document.getElementById("button");

  dampingSlider.oninput = function () {
    damping = parseFloat(this.value);
  };

  button.onclick = function () {
    if (springs.length > 0) {
      let index = floor(random(springs.length));
      springs.splice(index, 1);
    }
  };

  for (let i = 0; i < N; ++i)
    particles.push(new Particle(random(width), random(height)));

  // string();
  // springs.push(new Spring(N-1, 0));
  // grid();
  // snowflake();
  // comb();
  // all_connected();
  // springs.push(new Spring(0, 1));
  // springs.push(new Spring(1, 2));
  // springs.push(new Spring(2, 0));
}


function forces() {

  for (let i = 0; i < N; ++i){
    for (let j = i+1; j < N;++j){
      let p1 = particles[i]
      let p2 = particles[j]

      let r = p5.Vector.sub(p2.r, p1.r);
      let r2 = r.magSq();
      let f = r2 == 0 ? 0 : qq/r2;
      r.normalize();
      r.mult(f);
      p2.a.sub(r);
      p1.a.add(r);
    }
  }

  for (let p of particles) {
    p.a.sub(p5.Vector.mult(p.v, damping));
  }

  for (let p of particles) {
    p.a.div(p.m);
  }
}

function mousePressed() {
  selected = null;
  for (const p of particles) {
    let d = dist(mouseX, mouseY, p.r.x, p.r.y);
    if (d < radius) {
      selected = p;
      dx = mouseX - p.r.x;
      dy = mouseY - p.r.y;
      break;
    }
  }
}

function mouseReleased() {
  selected = null;
}

function draw() {
  background(220);

  if (mouseIsPressed === true && selected !== null) {
    selected.r.x = mouseX - dx;
    selected.r.y = mouseY - dy;
    selected.v.x = 0;
    selected.v.y = 0;
  }

  forces()

  for (let p of particles){p.update()}

  for (const s of springs) {
    s.draw();
  }

  for (const p of particles) {
    p.draw();
  }

}