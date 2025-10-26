let particles = [];

const radius = 10;
const qq = 67500;
let damping = 13.0;

const dt = 1 / 60;


let selected = null;
let dx = 0;
let dy = 0;

N = 2;

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
    fill(255)
    circle(this.r.x, this.r.y, radius*2);
  }
}

class Anchor {
  constructor(x, y, m = 1.0) {
    this.r = createVector(x, y);
    this.v = createVector(0, 0);
    this.a = createVector(0, 0);
    this.m = m;
  }

  update() {
  }

  draw() {
    fill(0)
    circle(this.r.x, this.r.y, radius*2);
  }
}


function setup() {
  createCanvas(600, 600);

  dampingSlider = document.getElementById("damping");
  button = document.getElementById("button");

  button.onclick = function () {
    console.log("Button");
  };

  particles.push(new Anchor(width/4, height/4, 1000.0));
  for (let i = 1; i < N; ++i)
    particles.push(new Particle(random(width), random(height)));
}


function forces() {

  for (let i = 0; i < N; ++i){
    for (let j = i+1; j < N;++j){
      let p1 = particles[i]
      let p2 = particles[j]

      let r = p5.Vector.sub(p2.r, p1.r);
      let r2 = r.magSq();

      let M = p1.m * p2.m;
      let f = qq*M/r2;
      r.normalize();
      r.mult(f);
      if (r2 >= 4*radius*radius){
        p1.a.add(r);
        p2.a.sub(r);
      } else {
        p1.v = createVector(0, 0);
        p2.v = createVector(0, 0);
      }
    }
  }

  for (let p of particles) {
    p.a.sub(p5.Vector.mult(p.v, damping));
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
  for (const p of particles) {
    p.update()
    p.draw();
  }

}