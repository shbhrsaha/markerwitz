var movie = bonsai.run(
  document.getElementById('movie'),
  {
    code: function() {
      // receive data from the other side
      var text = new Text().addTo(stage);

      startX = 0;
      startY = 0;

      stage.on('message:startClick', function(data) {
        startX = data.x;
        startY = data.y;
      });
      stage.on('message:endClick', function(data){
                  radius = Math.sqrt(Math.pow((data.x - startX), 2) + Math.pow((data.y - startY), 2));
        text.attr('text', radius);


        new Circle(startX,startY, radius).fill('random'). addTo(stage);
      });

      stage.sendMessage('ready', {});
    }
  }
);

inClick = false;

// emitted before code gets executed
movie.on('load', function() {

  // receive event from the runner context
  movie.on('message:ready', function() {
    $(document).click(function(e){
      if(!inClick){
        movie.sendMessage('startClick', {
          x: e.pageX,
          y: e.pageY
        });
        inClick = true;
      }
      else{
        movie.sendMessage('endClick', {
          x: e.pageX,
          y: e.pageY
        });
        inClick = false;
      }

    });


  });

});
