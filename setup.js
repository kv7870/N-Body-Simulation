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
