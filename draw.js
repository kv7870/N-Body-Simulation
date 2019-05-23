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
