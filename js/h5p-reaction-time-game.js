H5P.ReactionTimeGame = (function ($, UI) {

  function ReactionTimeGame(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  }
  ReactionTimeGame.prototype.attach = function ($container) {
    const that=this;
    $container.css('height', $(window).width()/2.5);
    const $mainContainer = $('<div class="main-container"></div>');
    const $startButton = $('<button class="start-button">Start</button>');
    $startButton.click(function() {
      $(this).remove();
      $('<canvas id="shape"></canvas>').appendTo($mainContainer);
      const canvasElement = $("#shape");
      const ctx = canvasElement[0].getContext("2d");
      var isEmpty = function(ctx){
        var data = ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height).data;
        return !Array.prototype.some.call(data, function(p){return p>0;});
      }
      // console.log(isEmpty(ctx));
      // console.log(setInterval(that.getRandomColor, 1000));
      setInterval(function(){
        console.log($("#shape").length);
        if(isEmpty(ctx)) {
          $("#shape").append(that.getRandomShape());
        }
        else {
          that.clearCanvas(ctx);
        }

      }, 1000);
    });
    $startButton.appendTo($mainContainer);
    $mainContainer.appendTo($container);
  };

  ReactionTimeGame.prototype.clearCanvas = function(ctx){
    let canvas = $("#shape");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  ReactionTimeGame.prototype.getRandomShape = function () {
    const that = this;
    const shapes = [that.square, that.triangle, that.circle];
    for (var i = 0; i < shapes.length; i++) {
        shape = shapes[Math.round(Math.random() * i)];
    }
    return shape;
  };

  ReactionTimeGame.prototype.getRandomColor = function ()  {

    var colors = ["red", "green", "blue", "black", "brown"];
    var color;
    for (var i = 0; i < colors.length; i++) {
        color = colors[Math.round(Math.random() * i)];
    }
    return color;
  }

  ReactionTimeGame.prototype.setRandomColor = function() {
    const that = this;
    const canvasElement = $("#shape");
    const ctx = canvasElement[0].getContext("2d");
    console.log(that.getRandomColor());
    ctx.fillStyle = that.getRandomColor();
    ctx.fill();
  }

  ReactionTimeGame.prototype.triangle = function() {
    const that = this;
    const canvasElement = $("#shape");
    const ctx = canvasElement[0].getContext("2d");
    ctx.beginPath();
    setInterval(that.setRandomColor, 1000);
    ctx.moveTo(150, 50);
    ctx.lineTo(150 + (80 / 2), 50 + 80);
    ctx.lineTo(150 - (80 / 2), 50 + 80);
    ctx.closePath();
    ctx.stroke();

  }

  ReactionTimeGame.prototype.square = function() {
    const that = this;
    const canvasElement = $("#shape");
    const ctx = canvasElement[0].getContext("2d");
    ctx.rect(100, 20, 80, 80);
    setInterval(that.setRandomColor, 1000);
    ctx.stroke();
  }

  ReactionTimeGame.prototype.circle = function() {
    const that = this;
    const canvasElement = $("#shape");
    const ctx = canvasElement[0].getContext("2d");
    setInterval(that.setRandomColor, 1000);
    ctx.beginPath();
    ctx.arc(150, 80, 50, 0, 2 * Math.PI);

    ctx.stroke();
  }

  return ReactionTimeGame;
})(H5P.jQuery, H5P.JoubelUI);
