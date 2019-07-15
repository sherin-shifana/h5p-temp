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
      // console.log(setInterval(that.getRandomColor, 1000));
      that.circle();
    });
    $startButton.appendTo($mainContainer);
    $mainContainer.appendTo($container);
  };

  ReactionTimeGame.prototype.triangle = function() {
    const canvasElement = $("#shape");
    const context = canvasElement[0].getContext("2d");
    context.beginPath();
    context.moveTo(150, 80);
    context.lineTo(150 + (80 / 2), 80 + 80);
    context.lineTo(150 - (80 / 2), 80 + 80);
    context.closePath();
    context.fillStyle = "red";
    context.fill();
  }

  ReactionTimeGame.prototype.getRandomColor = function ()  {

  	var colors = ["red", "green", "blue", "black", "brown"];
    var color;
  	for (var i = 0; i < 5; i++) {
  			color = colors[Math.round(Math.random() * 5)];
  	} //ends for loop
  	return color;
  } // ends getRandomColor Function

  ReactionTimeGame.prototype.square = function() {
    const canvasElement = $("#shape");
    const ctx = canvasElement[0].getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(100, 50, 80, 80);
    ctx.stroke();
  }

  ReactionTimeGame.prototype.circle = function() {
    const that = this;
    const canvasElement = $("#shape");
    const ctx = canvasElement[0].getContext("2d");
    ctx.fillStyle = setInterval(that.getRandomColor, 1000);
    ctx.beginPath();
    ctx.arc(100, 80, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  return ReactionTimeGame;
})(H5P.jQuery, H5P.JoubelUI);
