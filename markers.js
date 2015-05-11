function bonsaiMain(){

  // Make all variables in config global in bonsai runner context.

  config = stage.options.config;
  configNames = Object.keys(config);
  configNames.forEach(function(name){
    functionString = name + "=" + config[name] + ";";
    eval(name + "=" + config[name] + ";");
  });

  routineID = "circles";
  circles();
  lines();

  stage.on('message:keypress', function(e){
    console.log(e);

    switch(e.key){
      case "c":
        routineID = "circles";
        break;
      case "l":
        routineID = "lines";
        break;
    }
  });


  stage.sendMessage("ready",{});

  function snapToPoint(x, y){

      if(!snap) return {x: x, y:y};

      self.importScripts('https://raw.githubusercontent.com/ubilabs/kd-tree-javascript/master/kdTree-min.js');


      var snapRadius = stage.options.config.snapRadius;

      var distance = function(a,b){
          return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
      }


      if(!stage.kdTree){
        stage.kdTree = new kdTree([], distance, ["x", "y"]);
        stage.kdTree.insert({x: x, y: y});
        return({x: x, y: y});
      }

      nearest = stage.kdTree.nearest({x: x, y: y}, 1, snapRadius);

      if(nearest.length > 0){
        // If there is a nearby point, return the nearby point
        return({x: nearest[0][0].x, y: nearest[0][0].y});
      }
      else{
        // Otherwise, add the new point and return it.
        stage.kdTree.insert({x: x, y: y});
        return({x: x, y: y});
      }
  }

  function guideCircles(){
    if(stage.circles){
      var i = 7;
    }
  }

  function circles() {

        // Keep track of all circles on the page
        if(!stage.circles){
          stage.circles = [];
        }

        inClick = false;
        startX = 0;
        startY = 0;

        stage.on('message:click', function(data) {
          if(routineID != "circles")  return;
          if(!inClick){
            startX = data.x;
            startY = data.y;
            inClick = true;
          }
          else{
            radius = Math.sqrt(Math.pow((data.x - startX), 2) + Math.pow((data.y - startY), 2));


            circle = new Circle(startX,startY,   radius).stroke(lineColor, lineWidth). addTo(stage);
            stage.circles.push(new CircleMeta(startX, startY, radius, circle));

            inClick = false;
          }

        });

  }


  function lines(){

    inLine = false;

    stage.on('message:click', function(data){

      if(routineID != "lines")  return;

      var data = snapToPoint(data.x, data.y);

      if(!inLine){
              inLine = true;
              path = new Path([
                ['moveTo', data.x, data.y]
            ]).stroke(lineColor, lineWidth).addTo(stage);
      }
      else{
        path.lineTo(data.x, data.y);
      }

      new Circle(data.x, data.y, 4).fill(lineColor).addTo(stage);
    });

    stage.on('message:dblclick', function(data){
      if(routineID != "lines")  return;

      new Circle(data.x, data.y, 4).fill(lineColor).addTo(stage);
      path.lineTo(data.x, data.y);
      inLine = false;
    });

  }


  function CircleMeta(x, y, r, circle){
    this.cX = parseFloat(x);
    this.cY = parseFloat(y);
    this.circle = circle;
    this.points = {};
    this.getClosestPoint = function(pX, pY){
      pX = parseFloat(pY);
      pY = parseFloat(pY)
      m=(cY-pY)/(cX-pX);  //slope
      b=cY-m*cX;  //or Py-m*Px.  Now you have a line in the form y=m*x+b
      X=  ((2*m*cY)*
          Math.pow(
            (Math.pow((-2*m*cY),2)
          -4*(cY*cY+cX*cX-b*b-2*b*cY-r*r)*(-1-m*m))
          ,1/2)
        )/(2*(cY*cY+cX*cX-b*b-2*b*cY-r*r));

      Y=m*X+b;
      // http://stackoverflow.com/questions/300871/best-way-to-find-a-point-on-a-circle-closest-to-a-given-point
      return({x: X, y: Y});
    }

  }




}
