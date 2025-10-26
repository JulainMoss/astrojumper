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

class Spring {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  draw() {
    const r1 = particles[this.i].r;
    const r2 = particles[this.j].r;

    line(r1.x, r1.y, r2.x, r2.y);
  }
}

function all_connected(){
  for (let i = 0; i < N; ++i){
    for (let j = i+1; j < N; ++j){
      springs.push(new Spring(i, j));
    }
  }
}

function string(){
  for (let i = 1; i < N; ++i) springs.push(new Spring(i, i-1));
}

function grid(){
  for (let x=0; x<L; ++x)
    for(let y=0;y<L; ++y){
      if (x+1 < L)springs.push(new Spring(x+y*L, x+1+y*L));
      if (y+1 < L)springs.push(new Spring(x+y*L, x+L+y*L));
  }
}

function snowflake(){
  springs.push(new Spring(0, 1));
  springs.push(new Spring(0, 2));
  springs.push(new Spring(0, 3));
  for(let x=4;x<N; ++x){
    let i = x;
    let j = Math.floor((x-2)/2);
    console.log("i: ", i, "j: ", j);
    springs.push(new Spring(i, j));
    }
}

function comb(){
  for (let x=0; x<L; ++x)
    for(let y=0;y<L; ++y){
      if (x+1 < L && Math.floor((x+y)/2) == Math.floor((x+1+y)/2))springs.push(new Spring(x+y*L, x+1+y*L));
      if (y+1 < L)springs.push(new Spring(x+y*L, x+L+y*L));
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
  comb();
  // all_connected();
  // springs.push(new Spring(0, 1));
  // springs.push(new Spring(1, 2));
  // springs.push(new Spring(2, 0));
}


function forces() {
  for (let s of springs){
    // console.log("i: ", s.i, "j: ", s.j);
    let p1 = particles[s.i];
    let p2 = particles[s.j];
    let r = p5.Vector.sub(p1.r, p2.r);
    let l = r.mag();
    let f = stiffness * (l - length);
    r.normalize().mult(f);
    p2.a.add(r);
    p1.a.sub(r);
  }

  for (let i = 0; i < N; ++i){
    for (let j = i+1; j < N;++j){
      let p1 = particles[i]
      let p2 = particles[j]

      let r = p5.Vector.sub(p1.r, p2.r);
      let r2 = r.magSq();
      let f = qq/r2;
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