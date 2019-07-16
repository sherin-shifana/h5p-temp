H5P.ReactionTimeGame = (function ($, UI) {

  function ReactionTimeGame(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  }

  ReactionTimeGame.prototype.attach = function ($container) {
    const that=this;
    $container.addClass('reaction-time-game');
    const $wrapper = $('<div class="wrapper"></div>');
    const $shape = $('<p>Shape:&nbsp;'+this.options.shape+'</p>');
    const $color = $('<p>Color:&nbsp'+this.options.color+'</p>');
    const $taskDescription = $('<div class="task-description">'+this.options.taskDescription+'<br/></div>');
    const $startButton = $('<button class="start-button">Start</button>');
    $shape.appendTo($taskDescription);
    $color.appendTo($taskDescription);
    $taskDescription.appendTo($wrapper);
    $startButton.appendTo($wrapper);
    $wrapper.appendTo($container);
  }

  return ReactionTimeGame;
})(H5P.jQuery, H5P.JoubelUI);
