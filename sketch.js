var G = 6.67408e-11;

var drawBox = false;
var bx = 1600, by = 0, bw = 1600, bh = 937;

 var planet = [];
 var n = 0;
 var dt = 86400.0;

 var earthM = 5.972e24;
 var earthR = 10; //earth radius = 5 px
 var distES = 1.49e11;

var addPressed = false;
var selectPressed = false;
var selectedPlanet = -1;
var id = 0;

var timeElapsed = 0;
 //149600000000;
 //distES = 149600000000; want dist earth to neptune, which is 18*distES,
 //so 1920/18 = 106.6
 //therefore distES represented by 100 pixels

 var SCALE = distES/100;  //scale distance

 planet[0] = new Body("Earth", earthM, earthR, 900 *SCALE, 440 *SCALE, 30300, 0, 0, 255, 0);
 planet[1] =  new Body("Sun", earthM*333000, earthR*5, 960 *SCALE, 540 *SCALE, 0, 0, 255, 255, 0);

 function Body(n,m,r,posX,posY,velocityX,velocityY, red, green, blue) {
  this.name = n;
  this.mass = m;
  this.radius = r;
  this.x = posX;
  this.y = posY;
  this.x0 = posX;
  this.y0 = posY;
  this.vx = velocityX;
  this.vy = velocityY;
  this.ax = 0;
  this.ay  = 0;
  this.id = id++;
  this.red = red;
  this.green = green;
  this.blue = blue;

  //member functions
  this.updateTrace = updateTrace;

  this.calcAcceleration = calcAcceleration;

  this.rk4 = rk4;
}


function setup() {
  createCanvas(1900,937);
  frameRate(60);

  fill(0,0,0);
  space = loadImage('assets/background.jpg');
  close = createButton("X");
  close.position(bx,by);
  close.size(50,50);
  close.style('font-size', '24px');
  close.style('background-color', "#ff0000");
  close.style('color', "#ffffff");

  mSlider = createSlider(0, earthM*3330000, 66.6e3);
  mSlider.style('width', '275px');
  mSlider.position(bx+15, by+170);

  rSlider = createSlider(1,500,250);
  rSlider.position(bx+15, by+270);
  rSlider.style('width','275px');

  vxSlider = createSlider(-50000, 50000, 0);
  vxSlider.position(bx+15, by+370);
  vxSlider.style('width','275px');

  vySlider = createSlider(-50000, 50000, 0);
  vySlider.position(bx+15, by+470);
  vySlider.style('width','275px');

  speedSlider = createSlider(0, 864000, 86400);
  speedSlider.position(bx+15, by+820);
  speedSlider.style('width', '275px');

  redSlider = createSlider(0, 255, 128);
  redSlider.position(bx+15, by+570);
  redSlider.style('width', '275px');

  greenSlider = createSlider(0, 255, 128);
  greenSlider.position(bx+15, by+640);
  greenSlider.style('width', '275px');

  blueSlider = createSlider(0, 255, 128);
  blueSlider.position(bx+15, by+710);
  blueSlider.style('width', '275px');

  input = createInput("");
  input.position(bx+85,by+85);
  input.style('width', '130px');

  submit = createButton("Submit");
  submit.position(bx+230, by+85);

  bSelect = createButton("Select");
  bSelect.position(930, 850);
  bSelect.style('width', '125px');
  bSelect.style('height', '50px');
  bSelect.style('font-size', '18px');

  bAdd = createButton("New planet");
  bAdd.position(700, 850);
  bAdd.style('width', '125px');
  bAdd.style('height', '50px');
  bAdd.style('font-size', '18px');

  hideOptions();
}

function draw() {
  clear();
  timeElapsed+=dt;
  background(0);
  image(space, 0, 0);

  close.mousePressed(hideOptions);
  bSelect.mousePressed(toggleSelect)
  bAdd.mousePressed(toggleAdd);

  aabb();

  for(var i=0; i<planet.length; i++) {
      planet[i].updateTrace();
      fill(planet[i].red, planet[i].green, planet[i].blue);

      circle(planet[i].x/SCALE, planet[i].y/SCALE, planet[i].radius*2);
      planet[i].rk4();
      n++;
    }

    fill(255,255,255);
    textSize(24);
    //text("HI", 100, 100);
    text("Time Elapsed: "+nf(timeElapsed/86400, 0, 0)+" days", 860, 75);
    if(drawBox) {
      fill(119,136,153);    //112,128,144
      rect(bx, by, bw, bh);
      textSize(18);
      fill(0);
      text("Name", bx+15, by+100);
      text("Mass", bx+135,by+160);
      text("Radius", bx+130, by+260);
      text("Horizontal Veloctiy", bx+90, by+360);
      text("Vertical Veloctiy", bx+95, by+460);
      text("Red", bx+140, by+560);
      text("Green", bx+135, by+630);
      text("Blue", bx+139, by+710);
      text("Simulation speed", bx+96, by+810);
      //text("Orbit eccentricity: ", bx+15, by+660);
      mSlider.input(updateMass);
      vxSlider.input(updateVx);
      vySlider.input(updateVy);
      planet[selectedPlanet].radius = rSlider.value();

      dt = speedSlider.value();
      planet[selectedPlanet].red = redSlider.value();
      planet[selectedPlanet].green = greenSlider.value();
      planet[selectedPlanet].blue = blueSlider.value();

      submit.mousePressed(editName);

    }
}


function updateTrace() {
    this.x0  = this.x;
    this.y0  = this.y;
}

function calcAcceleration(x, y)
{
  this.ax = 0;
  this.ay = 0;

  for(var j=0; j<planet.length; j++) {
    if(this.id!=planet[j].id) {
      var Mj = planet[j].mass;
      var xj = planet[j].x0;
      var yj = planet[j].y0;
      var dx = xj-x;
      var dy = yj-y;
      //var g = G * Mj;
      //var d3Inv = 1 / (Math.pow(  ((xj - x)*SCALE) * ((xj - x)*SCALE) + ((yj - y)*SCALE) * ((yj - y)*SCALE), 1.5) );

      var d = Math.pow(dx*dx + dy*dy, 0.5);

      if(d/SCALE > this.radius + planet[j].radius) {
        this.ax += (G * Mj * dx/Math.pow(d, 3));
        this.ay += (G * Mj * dy/Math.pow(d, 3));
      }
    }
  //this.ax = (g * SCALE*(xj - x) * d3Inv);
  //this.ay = (g * SCALE*(yj - y) * d3Inv);
    }
}

function rk4() {
     var x  = this.x;
     var y  = this.y;
     var vx = this.vx;
     var vy = this.vy;
     var kx = [];
     var ky = [];
     var kvx = [];
     var kvy = [];

     for(var i=0; i<4; i++) {
      kx[i]=0;
      ky[i]=0;
      kvx[i]=0;
      kvy[i]=0;
     }

     var tx = [], ty = [], tvx = [], tvy = [];


       //stage 1
    tx[0] = vx;
    ty[0] = vy;

    this.calcAcceleration(x, y);

     tvx[0] = this.ax;
     tvy[0] = this.ay;

       // stage2
     tx[1] = vx + 0.5 * dt * tvx[0];
     ty[1] = vy + 0.5 * dt * tvy[0];

     this.calcAcceleration(x+0.5*dt* tx[0], y+ 0.5 * dt * ty[0]);

     tvx[1] = this.ax;
     tvy[1] = this.ay;

       // stage 3
     tx[2] = vx + 0.5 * dt * tvx[1];
     ty[2] = vy + 0.5 * dt * tvy[1];

     this.calcAcceleration(x + 0.5 * dt * tx[1], y + 0.5 * dt * ty[1]);

     tvx[2] = this.ax;
     tvy[2] = this.ay;

       // stage 4
     tx[3] = vx + dt * tvx[2];
     ty[3] = vy + dt * tvy[2];

     this.calcAcceleration(x + dt * tx[2], y + dt * ty[2]);

     tvx[3] = this.ax;
     tvy[3] = this.ay;

     for (var k = 0; k < 4; k++) {
       kx[k]  += tx[k];
       ky[k]  += ty[k];
       kvx[k] += tvx[k];
       kvy[k] += tvy[k];
    }

  this.x += ((kx[0] + 2 * (kx[1] + kx[2]) + kx[3]) * dt / 6);
  this.y += ((ky[0] + 2 * (ky[1] + ky[2]) + ky[3]) * dt / 6);

  this.vx += ((kvx[0] + 2 * (kvx[1] + kvx[2]) + kvx[3]) * dt / 6);
  this.vy += ((kvy[0] + 2 * (kvy[1] + kvy[2]) + kvy[3]) * dt / 6);
}
