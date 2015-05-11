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

      if(config.wsPort){

        screenX = 0;
        screenY = 0;

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
          screenX = event.data.x;
          screenY = event.data.y;
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
