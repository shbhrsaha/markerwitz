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
        $(document).click(function(e){
          console.log('click');
            movie.sendMessage('click', {
              x: e.pageX,
              y: e.pageY
            });
          });

      $(document).dblclick(function(e){
         console.log('dblclick');
        movie.sendMessage('dblclick', {
              x: e.pageX,
              y: e.pageY
        });
      });


    });

  });



});
