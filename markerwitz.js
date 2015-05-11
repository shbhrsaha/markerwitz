$(document).ready(function(e){


  var movie = bonsai.run(
    document.getElementById('movie'),
    {
      code: bonsaiMain,
      config: config
    }
  );

  // emitted before code gets executed
  movie.on('load', function() {

    // receive event from the runner context
    movie.on('message:ready', function() {

      /* Get coordinates from ws port (for example, if webcam is the control) */
      if(config.wsPort){

        screenX = 0;
        screenY = 0;

        /* Go from projector screen size to page screen size */
        function mapToScreen(x, y){
          x = x * parseFloat($(window).width()) / config.gridX;
          y = y * parseFloat($(window).height()) / config.gridY;
          return {x: x, y: y};
        }

        // setup websocket with callbacks
        var ws = new WebSocket('ws://localhost:' + config.wsPort);
        ws.onopen = function() {
          console.log('CONNECT');
        };
        ws.onclose = function() {
          console.log('DISCONNECT');
        };
        ws.onmessage = function(event) {
          console.log('MESSAGE: ' + event.data);
          data = event.data.split(',');
          //data = mapToScreen(event.data.x, event.data.y);
          screenX = parseFloat(data[0]);
          screenY = parseFloat(data[1]);
          movie.sendMessage('mouseMove', {
            x: screenX,
            y: screenY
          });
        };

      }

      /* No projector/camera attached */
      $(document).click(function(e){
          console.log('click');
            movie.sendMessage('click', {
              x: config.wsPort ? screenX : e.pageX,
              y: config.wsPort ? screenY: e.pageY
            });
          });

      $(document).dblclick(function(e){
         console.log('dblclick');
        movie.sendMessage('dblclick', {
            x: config.wsPort ? screenX : e.pageX,
            y: config.wsPort ? screenY: e.pageY
        });
      });

      $(document).keypress(function(e){
        console.log('keypress');
        movie.sendMessage('keypress', {
          key: String.fromCharCode(e.keyCode)
        });
      });





    });

  });



});
