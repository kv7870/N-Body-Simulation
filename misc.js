//misc.js
function mousePressed() {
  var hide = true;
  if(selectPressed) {
   for(var i=0; i<planet.length; i++) {
     if( (mouseX-planet[i].x/SCALE)*(mouseX-planet[i].x/SCALE) + (mouseY-planet[i].y/SCALE)*(mouseY-planet[i].y/SCALE)
     <= planet[i].radius*planet[i].radius) {
       selectedPlanet = planet[i].id;
       showOptions();
       console.log(planet[selectedPlanet].radius);
       hide = false;
//break;
     }
   }
   if(hide && mouseX < bx)
      hideOptions();
 }
 else if(addPressed) {
    if((drawBox && mouseX<bx) || !drawBox) {
      selectedPlanet = id;
      var r = Math.random()*(256-100)+100;
      var g = Math.random()*(256-100)+100;
      var b = Math.random()*(256-100)+100;
      var tempPlanet = new Body("Planet " + (id+1), 5.972e20, 10, mouseX*SCALE, mouseY*SCALE, -1000, -3030.0,
      r,g,b);
      planet.push(tempPlanet);
      hideOptions();
    }
  }
}

function toggleAdd() {
  addPressed = true;
  selectPressed = false;
  bAdd.style('background-color', '#00ff00');
  bSelect.style('background-color', '#ffffff');
}

function toggleSelect() {
  selectPressed = true;
  addPressed = false;
  bSelect.style('background-color', '#00ff00');
  bAdd.style('background-color', '#ffffff');
}

function showOptions() {
  console.log(selectedPlanet);
  drawBox = true;

  mSlider.show();
  vxSlider.show();
  vySlider.show();
  rSlider.show();
  speedSlider.show();
  input.show();
  submit.show();
  close.show();

  redSlider.show();
  greenSlider.show();
  blueSlider.show();

  input.value(planet[selectedPlanet].name);
  mSlider.value(planet[selectedPlanet].mass);
  rSlider.value(planet[selectedPlanet].radius);
  vxSlider.value(planet[selectedPlanet].vx);
  vySlider.value(planet[selectedPlanet].vy);
  speedSlider.value(dt);

  redSlider.value(planet[selectedPlanet].red);
  greenSlider.value(planet[selectedPlanet].green);
  blueSlider.value(planet[selectedPlanet].blue);
}


function hideOptions() {
    //button.html("Show");
    drawBox = false;
    close.hide();
    submit.hide();
    mSlider.hide();
    vxSlider.hide();
    vySlider.hide();
    rSlider.hide();
    input.hide();
    speedSlider.hide();
    redSlider.hide();
    greenSlider.hide();
    blueSlider.hide();

}


//axis aligned bounding box
function aabb() {

  for(var i=0; i<planet.length; i++) {
    //bounding boxes are overlapping
    for(var j=0; j<planet.length; j++) {
      if(planet[j].id!=planet[i].id) {
        if (planet[i].x + planet[i].radius*SCALE + planet[j].radius*SCALE > planet[j].x
          && planet[i].x < planet[j].x + planet[i].radius*SCALE + planet[j].radius*SCALE
          && planet[i].y + planet[i].radius*SCALE + planet[j].radius*SCALE > planet[j].y
          && planet[i].y < planet[j].y + planet[i].radius*SCALE + planet[j].radius*SCALE) {

            var dist = Math.sqrt( (planet[i].x - planet[j].x) * (planet[i].x - planet[j].x)
            + (planet[i].y - planet[j].y) * (planet[i].y - planet[j].y) );

            //balls have collided
            if (dist/SCALE < planet[i].radius + planet[j].radius) {
              id--;

              if(planet[i].mass > planet[j].mass) {
                if(selectedPlanet == j) {
                  selectedPlanet = -1;
                  hideOptions();
                }
                else if(selectedPlanet > j)
                  selectedPlanet--;

                for(var n = j+1; n<planet.length; n++) {
                  (planet[n].id)--;
                }

                planet.splice(j, 1);
              }

            else {
              if(selectedPlanet == i) {
                selectedPlanet = -1;
                hideOptions();
              }
              else if (selectedPlanet>i)
                selectedPlanet--;


              for(var n = i+1; n<planet.length; n++) {
                (planet[n].id)--;
              }
              planet.splice(i, 1);
          }

          break;

          }
        }
      }
    }
  }
}


function updateMass() {
  planet[selectedPlanet].mass = mSlider.value();
}

function updateVx() {
  planet[selectedPlanet].vx = vxSlider.value();
}

function updateVy() {
  planet[selectedPlanet].vy = vySlider.value();
}

function editName() {
  planet[selectedPlanet].name = input.value();
}
