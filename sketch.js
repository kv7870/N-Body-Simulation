//universal gravitational constant
var G = 6.67408e-11;

//draw options box
var drawBox = false;
//coordinates of options box
var bx = 1600, by = 0, bw = 1600, bh = 937;

//array of planets
 var planet = [];

 //time step (delta time) used in RK4
 var dt = 86400.0;

//mass of Earth in kg
 var earthM = 5.972e24;
//radius of Earth in pixels
 var earthR = 10; //earth radius = 5 px
//distance from Earth to Sun in metres; this will serve as unit of distance
 var distES = 1.49e11;

//tracks whether "add planet" button is pressed
var addPressed = false;
//tracks whether "select" button is pressed
var selectPressed = false;

//id of planet that user clicks on
var selectedPlanet = -1;

//id assigned to each newly spawned planet
var id = 0;

//# of dt passed since beginning
var timeElapsed = 0;

//want to represent distance from Earth to Neptune on screen;
//dist Earth-Neptune is ~18 * dist Earth-Sun; canvas is 1900 pixels wide, and 1900/18 ~= 100
//therefore let 100 pixels represent dist Earth-Sun
 var SCALE = distES/100;

//resolution
var SCREEN_W = 1900;
var SCREEN_H = 937;

 planet[0] = new Body("Earth", earthM, earthR, 900 *SCALE, 440 *SCALE, 30300, 0, 0, 255, 0);
 planet[1] =  new Body("Sun", earthM*333000, earthR*5, 960 *SCALE, 540 *SCALE, 0, 0, 255, 255, 0);

//planet "class"; stores data about the planet
 function Body(n,m,r,posX,posY,velocityX,velocityY, red, green, blue) {
  this.name = n;          //name of planet
  this.mass = m;          //mass of planet in kg
  this.radius = r;        //radius of planet in metres
  this.x = posX;          //x-coordinate of planet (in pixels)
  this.y = posY;          //y-coordinate of planet  (in pixels)
  this.x0 = posX;         //initial x-coord of planet
  this.y0 = posY;         //initial y-coord of planet
  this.vx = velocityX;    //horizontal velocity of planet (m/s)
  this.vy = velocityY;    //vertical velocity of planet (m/s)
  this.ax = 0;            //horizontal acceleration of planet (m/s^2)
  this.ay  = 0;           //vertical acceleration of planet (m/s^2)
  this.id = id++;         //ID of planet (0,1,2,3...)

  //RGB values of planet
  this.red = red;
  this.green = green;
  this.blue = blue;

  //member functions
  this.updateTrace = updateTrace;

  //calculate planet's acceleration due to gravity
  this.calcAcceleration = calcAcceleration;

  //integrate planet's acceleration using RK4 to obtain next (x, y)
  this.rk4 = rk4;
}


//setup() is a p5.js function that is called on startup
function setup() {
  createCanvas(SCREEN_W,SCREEN_H);
  frameRate(60);

  fill(0,0,0);
  space = loadImage('assets/background.jpg');

  //create and initialize the "X" button on the corner of the options box
  close = createButton("X");
  close.position(bx,by);
  close.size(50,50);
  close.style('font-size', '24px');
  close.style('background-color', "#ff0000");
  close.style('color', "#ffffff");

  //slider that adjusts planet's mass
  mSlider = createSlider(0, earthM*3330000, 66.6e3);
  mSlider.style('width', '275px');
  mSlider.position(bx+15, by+170);

  //slider that adjusts radius
  rSlider = createSlider(1,500,250);
  rSlider.position(bx+15, by+270);
  rSlider.style('width','275px');

  //slider that adjusts horizontal velocity
  vxSlider = createSlider(-50000, 50000, 0);
  vxSlider.position(bx+15, by+370);
  vxSlider.style('width','275px');

  //slider that adjusts vertical velocity
  vySlider = createSlider(-50000, 50000, 0);
  vySlider.position(bx+15, by+470);
  vySlider.style('width','275px');

  //slider that adjusts dt (time step, i.e. simulation speed)
  speedSlider = createSlider(0, 864000, 86400);
  speedSlider.position(bx+15, by+820);
  speedSlider.style('width', '275px');

  //sliders that adjust RGB value of planet
  redSlider = createSlider(0, 255, 128);
  redSlider.position(bx+15, by+570);
  redSlider.style('width', '275px');

  greenSlider = createSlider(0, 255, 128);
  greenSlider.position(bx+15, by+640);
  greenSlider.style('width', '275px');

  blueSlider = createSlider(0, 255, 128);
  blueSlider.position(bx+15, by+710);
  blueSlider.style('width', '275px');

  //input box that displays and lets user enter planet's name
  input = createInput("");
  input.position(bx+85,by+85);
  input.style('width', '130px');

  //button that assigns user's input to planet's name
  submit = createButton("Submit");
  submit.position(bx+230, by+85);

  //"Select" button which, when pressed,
  //lets user click on existing planets to adjust its properties
  bSelect = createButton("Select");
  bSelect.position(930, 850);
  bSelect.style('width', '125px');
  bSelect.style('height', '50px');
  bSelect.style('font-size', '18px');

  //"New planet" button which, when pressed,
  //lets user spawn a new planet at location of mouse click
  bAdd = createButton("New planet");
  bAdd.position(700, 850);
  bAdd.style('width', '125px');
  bAdd.style('height', '50px');
  bAdd.style('font-size', '18px');

  //hide buttons, sliders, and options box on startup
  hideOptions();
}

//p5.js function that is automatically called 60 times per second
function draw() {
  clear();  //clear canvas to create animation

  timeElapsed += dt;
  background(0);
  image(space, 0, 0); //draw space background

  //if "X" button is pressed, hide options box
  close.mousePressed(hideOptions);
  //if "select" button is pressed, call toggleSelect(), which enters 'selection mode'
  bSelect.mousePressed(toggleSelect)

  //if "New planet" button is pressed, call toggleAdd(), which enters 'create' mode
  bAdd.mousePressed(toggleAdd);

  //check collision between planets using axis-aligned bounding boxes
  aabb();

  for(var i=0; i<planet.length; i++) {
      planet[i].updateTrace();
      fill(planet[i].red, planet[i].green, planet[i].blue);

      circle(planet[i].x/SCALE, planet[i].y/SCALE, planet[i].radius*2);
      planet[i].rk4();
    }

    fill(255,255,255);
    textSize(24);
    text("Time Elapsed: "+nf(timeElapsed/86400, 0, 0)+" days", 860, 75);

    //draw options box
    if(drawBox) {
      fill(119,136,153);    //112,128,144
      rect(bx, by, bw, bh);
      textSize(18);
      fill(0);
      text("Name:", bx+15, by+100);
      text("Mass:", bx+25,by+160);
      text((planet[selectedPlanet].mass).toExponential(3) + " kg", bx+110, by+160);

      text("Radius:", bx+25, by+260);
      text(nf((planet[selectedPlanet].radius*SCALE)/1000, 0, 0) + " km", bx+110, by+260);

      text("Velocity (x):", bx+25, by+360);
      text(nf(planet[selectedPlanet].vx, 0, 3) + " m/s", bx+140, by+360);

      text("Velocity (y):", bx+25, by+460);
      text(nf(planet[selectedPlanet].vy, 0, 3) + " m/s", bx+140, by+460);

      text("Red:", bx+25, by+560);
      text(nf(planet[selectedPlanet].red, 0, 0), bx+92, by+560);

      text("Green:", bx+25, by+630);
      text(nf(planet[selectedPlanet].green, 0, 0), bx+95, by+630);

      text("Blue:", bx+25, by+710);
      text(nf(planet[selectedPlanet].blue, 0, 0), bx+95, by+710);

      text("Simulation speed:", bx+25, by+810);
      text(nf(dt/86400, 0, 3) + " day(s)", bx+180, by+810);

      //since vx and vy are constantly changing, only make vx & vy match their
      //respective slider position when the user adjusts the slider
      vxSlider.input(updateVx);
      vySlider.input(updateVy);
      //mSlider.input(updateMass);

      //since the following values are not constantly changing, they can be set
      //to a constant corresponding to the slider's position
      planet[selectedPlanet].mass = mSlider.value();
      planet[selectedPlanet].radius = rSlider.value();
      dt = speedSlider.value();
      planet[selectedPlanet].red = redSlider.value();
      planet[selectedPlanet].green = greenSlider.value();
      planet[selectedPlanet].blue = blueSlider.value();

      submit.mousePressed(editName);
    }
}

//set planet's initial coordinates to its current coordinates in preparation
//for next round of RK4
function updateTrace() {
    this.x0  = this.x;
    this.y0  = this.y;
}

//member function that calculates the net acceleration of the planet in question (this)
function calcAcceleration(x, y) {
  this.ax = 0;
  this.ay = 0;

  //calculate each planet's gravitational pull on the planet in question,
  //and later add them up to obtain that planet's net acceleration
  for(var j=0; j<planet.length; j++) {
    if(this.id!=planet[j].id) {
      //'j' subscript refers to other planets
      var mj = planet[j].mass;
      var xj = planet[j].x0;
      var yj = planet[j].y0;

      //distance between centers of planet[j] and planet[i]
      var dx = xj-x;
      var dy = yj-y;

      //The following section uses Newton's 2nd law & law of universal gravitation to calculate acceleration;
      //Fnet = ma, and Fnet = sum Fg;
      //ma = (G * m * mj)/(d^2);
      //Cancel m from both sides to get a = (G * mj)/(d^2);
      //Split into components and written in vector form:
      //ax = (G * mg *(x-xj)) / (d^3)
      //ay = (G * mg *(j-jj)) / (d^3)
      //See lined paper for more details on derivation

      //calculate the distance between the centers of the two planets using the distance formula;
      //since d is in metres, it must be converted to pixels by dividing by SCALE
      //so that it matches the units of radius (in pixels)
      var d = Math.pow(dx*dx + dy*dy, 0.5);

      //check that the two planets have not collided
      if(d/SCALE > this.radius + planet[j].radius) {
        //sum up the acceleration of the planet in question
        this.ax += (G * mj * dx/Math.pow(d, 3));
        this.ay += (G * mj * dy/Math.pow(d, 3));
      }
    }
  }
}

//integrate acceleration with Runge-Kutta 4th order
function rk4() {
     var x  = this.x;
     var y  = this.y;
     var vx = this.vx;
     var vy = this.vy;

     //there are 4 k's for x,y, and 4 k's for vx, vy
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

     //Position is a function of time,
     //velocity is a function of position (derivative of position), and
     //acceleration is a function of velocity (derivative of velocity).
     //Thus, integrating acceleration gives the rate at which velocity is changing
     //with respect to time, and integrating velocity gives the
     //rate at which position is changing w.r.t to time, which gives an estimate of
     //the planet's next (x,y) coordinates

    //Integration is accomplished numerically with RK4, which consists of 4 stages for greater stability.
    //The 4 k values of each stage are calculated from the k values of the previous stage.
    //Adding up the k values (which can be thought of as change in position)
    //in a certain way and multiplying by dt gives the new (x,y) position.

    //The following is based on the standard RK4 formula; see documentation for more details

    //stage 1
    kx[0] = vx;
    ky[0] = vy;

    this.calcAcceleration(x, y);

    kvx[0] = this.ax;
    kvy[0] = this.ay;

    //stage 2
    kx[1] = vx + 0.5 * dt * kvx[0];
    ky[1] = vy + 0.5 * dt * kvy[0];

    this.calcAcceleration(x+0.5*dt* kx[0], y+ 0.5 * dt * ky[0]);

    kvx[1] = this.ax;
    kvy[1] = this.ay;

    //stage 3
    kx[2] = vx + 0.5 * dt * kvx[1];
    ky[2] = vy + 0.5 * dt * kvy[1];

    this.calcAcceleration(x + 0.5 * dt * kx[1], y + 0.5 * dt * ky[1]);

    kvx[2] = this.ax;
    kvy[2] = this.ay;

    //stage 4
    kx[3] = vx + dt * kvx[2];
    ky[3] = vy + dt * kvy[2];

    this.calcAcceleration(x + dt * kx[2], y + dt * ky[2]);

    kvx[3] = this.ax;
    kvy[3] = this.ay;

    //position's rate of change * delta time = change in position;
    //add the change in position to the current (x,y) coordinates
    //to obtain the planet's new position
    this.x += ((kx[0] + 2 * (kx[1] + kx[2]) + kx[3]) * dt / 6);
    this.y += ((ky[0] + 2 * (ky[1] + ky[2]) + ky[3]) * dt / 6);

    //do the same to obtain the planet's new velocity
    this.vx += ((kvx[0] + 2 * (kvx[1] + kvx[2]) + kvx[3]) * dt / 6);
    this.vy += ((kvy[0] + 2 * (kvy[1] + kvy[2]) + kvy[3]) * dt / 6);
}
