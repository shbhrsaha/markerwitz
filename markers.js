bonsai.document = document;

function bonsaiMain(){

  lines();

  function snapToPoint(x, y){

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


  function circle() {
        text = new Text().addTo(stage);
        inClick = false;
        startX = 0;
        startY = 0;

        stage.on('message:click', function(data) {
          text.attr('text', inClick);
          if(!inClick){
            startX = data.x;
            startY = data.y;
            inClick = true;
          }
          else{
            radius = Math.sqrt(Math.pow((data.x - startX), 2) + Math.pow((data.y - startY), 2));
            text.attr('text', radius);

            new Circle(startX,startY,   radius).fill('random'). addTo(stage);

            inClick = false;
          }

        });
        stage.sendMessage('ready', {});
  }


  function lines(){

    lineWidth = stage.options.config.lineWidth;

    text = new Text().addTo(stage);

    inLine = false;

    stage.on('message:click', function(data){

      console.log(data);
      var data = snapToPoint(data.x, data.y);

      console.log(data);
      if(!inLine){
              inLine = true;
              path = new Path([
                ['moveTo', data.x, data.y]
            ]).stroke('#99FF66', lineWidth).addTo(stage);
      }
      else{
        path.lineTo(data.x, data.y);
      }

      new Circle(data.x, data.y, 4).fill('#99FF66').addTo(stage);
    });

    stage.on('message:dblclick', function(data){
      new Circle(data.x, data.y, 4).fill('#99FF66').addTo(stage);
      path.lineTo(data.x, data.y);
      inLine = false;
    });
    stage.sendMessage('ready', {});
  }

}
