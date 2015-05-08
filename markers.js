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
  lineWidth = 5;
  text = new Text().addTo(stage);

  inLine = false;

  stage.on('message:click', function(data){
    if(!inLine){
            inLine = true;
            path = new Path([
              ['moveTo', data.x, data.y]
          ]).stroke('green', lineWidth).addTo(stage);
    }
    else{
      path.lineTo(data.x, data.y);
    }

    new Circle(data.x, data.y, 4).fill('green').addTo(stage);
  });

  stage.on('message:dblclick', function(data){
    new Circle(data.x, data.y, 4).fill('green').addTo(stage);
    path.lineTo(data.x, data.y);
    inLine = false;
  });
  stage.sendMessage('ready', {});
}
