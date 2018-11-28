var bugs = [];
var sugar = [];

var cWidth = 500;
var cHeight = 500;

var sugarPop = [];
var foodPop = [];
var bugPop = [];

class Bug {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.clr = color(50,200,50);
    this.food = 50;
    this.dead = false;
    bugs.push(this);
  }

  draw() {
    fill(this.clr);
    rect(this.x, this.y, gridsize, gridsize);
    fill(0);
    textSize(10);
    text(this.food, this.x+10, this.y+20)
  }

  move() {
    if (frameCount % 10 != 0) {return;}
    if (this.food <= 0) {this.dead = true;}
    let dir = floor(random(10));
    if (dir == 0 && this.x < width-gridsize) {
      this.x += gridsize;
    }
    if (dir == 1 && this.x > 0) {
      this.x -= gridsize;
    }
    if (dir == 2 && this.y < cHeight-gridsize) {
      this.y += gridsize;
    }
    if (dir == 3 && this.y > 0) {
      this.y -= gridsize;
    }


    this.food--;


    if (this.food > 25 && dir == 9 && random(100) < 5) {
      let b = new Bug(this.x, this.y);
      b.food = round(this.food/2);
      this.food = b.food;
    }

    let foundFood = checkFoodAt(this.x, this.y)
    if (foundFood && this.food < 500) {
      foundFood.num-=5;
      this.food+=5;
    }
  }

  update() {
    this.move();
    this.draw();
  }
}

class Sugar {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.num = 25;
    this.dead = false;

    sugar.push(this);
  }

  draw() {
    fill(255,255,255,this.num/25 * 255);
    rect(this.x, this.y, gridsize, gridsize);
  }

  update() {
    if (this.num < 25 && frameCount % 50 == 0) {
      this.num++;
    }
    this.draw();
  }
}

class Mushroom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.num = 25;
    this.dead = false;

    if (checkFoodAt(x,y)) {this.dead = true}
    sugar.push(this);
  }

  draw() {
    fill(255,100,100,this.num/25 * 255);
    rect(this.x, this.y, gridsize, gridsize);
  }

  update() {
    if (frameCount % 250 == 0) {
      if (this.num < 50) {
        this.num++;
      }
      if (random(100) < 50) {new Mushroom(this.x + floor(random(2))*gridsize, this.y + floor(random(2))*gridsize)}
    }
    this.draw();
    if (this.num <= 0) {this.dead = true;}
  }
}

var gridsize = 25;

function setup() {
  createCanvas(cWidth, cHeight + 150);
  while(bugs.length < 5) {
    new Bug(floor(random(width/gridsize))*gridsize, floor(random(cHeight/gridsize))*gridsize);
  }
  createBlock(3,3,6,6,Mushroom);
  createBlock(11,11,6,6,Mushroom);
  //createBlock(10,10,10,10,Sugar);
}

function createBlock(xx, yy, w, h, c) {
  for (let x = 0; x < w*gridsize; x += gridsize) {
    for (let y = 0; y < h*gridsize; y += gridsize) {
      new c(xx*gridsize+x, yy*gridsize+y);
    }
  }
}

function draw() {
  background(60,80,160);

  bugs = bugs.filter((bug) => !bug.dead);
  sugar = sugar.filter((sugar) => !sugar.dead);

  sugar.forEach((sugar) => {sugar.update()});
  bugs.forEach((bug) => {bug.update()});

  drawGrid();

  if (frameCount % 60 == 0) {
    let val = 0;
    for (let s of sugar) {
      val += s.num;
    }
    sugarPop.push(val);

    let foodVal = 0;
    let bugVal = 0;
    for (let b of bugs) {
      foodVal += b.food;
      bugVal += 1;
    }
    foodPop.push(foodVal);
    bugPop.push(bugVal);
  }

  drawGraph();
}

function drawGraph() {
  let sugarPopMax = Math.max.apply(null, sugarPop);
  let foodPopMax = Math.max.apply(null, foodPop);
  let bugPopMax = Math.max.apply(null, bugPop);
  fill(0);
  rect(0, cHeight, width, 150);
  noFill();
  stroke(200,0,0);
  beginShape();
    for (let [i, s] of sugarPop.entries()) {
      vertex(width/(sugarPop.length+1)*i, height - (s/sugarPopMax * 120));
    }
  endShape(OPEN);

  stroke(0,200,0);
  beginShape();
    for (let [i, s] of foodPop.entries()) {
      vertex(width/(foodPop.length+1)*i, height - (s/foodPopMax * 120));
    }
  endShape(OPEN);

  stroke(0,0,200);
  beginShape();
    for (let [i, s] of bugPop.entries()) {
      vertex(width/(bugPop.length+1)*i, height - (s/bugPopMax * 120));
    }
  endShape(OPEN);
}

function checkFoodAt(x, y) {
  for (let s of sugar) {
    if (s.num > 0 && s.x == x && s.y == y) {
      return s;
    }
  }
  return false;
}

function drawGrid() {
  stroke(180,0,120);
  for(let x = 0; x <= width; x += gridsize) {
    line(x, 0, x, cHeight);
  }
  for(let y = 0; y <= cHeight; y += gridsize) {
    line(0, y, width, y);
  }
  noStroke();
}
