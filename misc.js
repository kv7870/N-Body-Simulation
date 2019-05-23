//p5.js function that is called when left-click button is pressed
function mousePressed() {
  var hide = true;

  //if in 'select' mode
  if(selectPressed) {
   for(var i=0; i<planet.length; i++) {
     //check if cursor is on a planet at time of mouse click
     if( (mouseX-planet[i].x/SCALE)*(mouseX-planet[i].x/SCALE) + (mouseY-planet[i].y/SCALE)*(mouseY-planet[i].y/SCALE)
     <= planet[i].radius*planet[i].radius) {
       selectedPlanet = planet[i].id;
       //if a planet is selected, show options menu for that planet
       showOptions();
       hide = false;
     }
   }

   //hide options menu if user clicks on the background
   if(hide && mouseX < bx)
      hideOptions();
 }

 //if in 'create' mode
 else if(addPressed) {
   //prevent planet from spawning behind options menu
    if((drawBox && mouseX<bx) || !drawBox) {
      selectedPlanet = id;
      var r = Math.random()*(256-100)+100;
      var g = Math.random()*(256-100)+100;
      var b = Math.random()*(256-100)+100;
      //create planet at coordinates of cursor at time of mouse click
      var tempPlanet = new Body("Planet " + (id+1), 5.972e20, 10, mouseX*SCALE, mouseY*SCALE, -1000, -3030.0,
      r,g,b);
      planet.push(tempPlanet);
      hideOptions();
    }
  }
}

//function called when "New planet" button is pressed
function toggleAdd() {
  addPressed = true;
  selectPressed = false;
  //change colour of buttons
  bAdd.style('background-color', '#00ff00');
  bSelect.style('background-color', '#ffffff');
}

function toggleSelect() {
  selectPressed = true;
  addPressed = false;
  //change colour of buttons
  bSelect.style('background-color', '#00ff00');
  bAdd.style('background-color', '#ffffff');
}

//show options menu (sliders and buttons)
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


//hide options menu
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


//aabb = axis aligned bounding box
//Bounding boxes refers to the square in which the circular planet is inscribed.
//To reduce computation, check if the boxes are overlapping before checking if
//circles are touching
function aabb() {

  for(var i=0; i<planet.length; i++) {

    for(var j=0; j<planet.length; j++) {
      if(planet[j].id!=planet[i].id) {
        //determine if bounding boxes are overlapping
        if (planet[i].x + planet[i].radius*SCALE + planet[j].radius*SCALE > planet[j].x
          && planet[i].x < planet[j].x + planet[i].radius*SCALE + planet[j].radius*SCALE
          && planet[i].y + planet[i].radius*SCALE + planet[j].radius*SCALE > planet[j].y
          && planet[i].y < planet[j].y + planet[i].radius*SCALE + planet[j].radius*SCALE) {

            //distance between centers of the two planets
            var dist = Math.sqrt( (planet[i].x - planet[j].x) * (planet[i].x - planet[j].x)
            + (planet[i].y - planet[j].y) * (planet[i].y - planet[j].y) );

            //balls have collided
            if (dist/SCALE < planet[i].radius + planet[j].radius) {
              id--;

              //the planet with the smaller mass gets destroyed
              if(planet[i].mass > planet[j].mass) {
                //close options menu if menu is open for the planet that got destroyed
                if(selectedPlanet == j) {
                  selectedPlanet = -1;
                  hideOptions();
                }
                //in the array, if the planet for which the options menu is displayed comes after the
                //planet that has been destroyed, decrement the selected planet's ID
                else if(selectedPlanet > j)
                  selectedPlanet--;

                for(var n = j+1; n<planet.length; n++) {
                  (planet[n].id)--;
                }
                //pop the planet that got destroyed
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

function updateVx() {
  planet[selectedPlanet].vx = vxSlider.value();
}

function updateVy() {
  planet[selectedPlanet].vy = vySlider.value();
}

function editName() {
  planet[selectedPlanet].name = input.value();
}
