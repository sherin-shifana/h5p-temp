H5P.ReactionTimeGame = (function ($, UI) {

  function ReactionTimeGame(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  }

  ReactionTimeGame.prototype.getShape = function () {
    const that = this;
    this.colors = ["red", "green", "blue", "black", "yellow"];
    this.shapes = ["triangle", "circle", "square"];

    for (let i = 0; i < this.colors.length; i++) {
      this.randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    for(let i=0; i<this.shapes.length; i++) {
      this.randomShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    }

    this.shape = new ReactionTimeGame.Shape(this.randomShape,this.randomColor);
    this.createdTime = Date.now();
    this.shape.appendTo(that.$wrapper, this.canvasSize);
    this.shape.$canvas.click(function(){
      that.afterClickShape();
    });
  };

  ReactionTimeGame.prototype.afterClickShape = function () {
    console.log(this.shape.$canvas);
    this.clickedTime = Date.now();
    this.reactionTime = (this.clickedTime - this.createdTime)/1000;
    return this.reactionTime;
  };

  ReactionTimeGame.prototype.startGame = function () {
    const that = this;
    this.number = 15;
    this.canvasSize = window.innerWidth/3.5 ;
    that.getShape();

    let x = 0;
    setInterval(function(){
      that.getShape();
      $('<div class="reaction-time">Reaction Time &nbsp; :&nbsp;'+that.reactionTime+'</div>').appendTo(that.$wrapper);
      // if (++x === 5) {
      //  clearInterval(a);
      // }
    },2000);


  };

  ReactionTimeGame.prototype.attach = function ($container) {
    const that=this;
    this.selShape = this.options.shape;
    this.selColor = this.options.color;
    $container.addClass('reaction-time-game');
    this.$wrapper = $('<div class="wrapper"></div>');
    const $shape = $('<p>Shape:&nbsp;'+this.selShape+'</p>');
    const $color = $('<p>Color:&nbsp'+this.selColor+'</p>');
    const $taskDescription = $('<div class="task-description">'+this.options.taskDescription+'<br/></div>');
    const $startButton = $('<button class="start-button">Start</button>');
    $startButton.click(function(){
      that.$wrapper.empty();
      that.startGame();
    });
    $shape.appendTo($taskDescription);
    $color.appendTo($taskDescription);
    $taskDescription.appendTo(this.$wrapper);
    $startButton.appendTo(this.$wrapper);
    this.$wrapper.appendTo($container);
  }

  return ReactionTimeGame;
})(H5P.jQuery, H5P.JoubelUI);
