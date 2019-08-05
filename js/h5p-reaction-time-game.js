H5P.ReactionTimeGame = (function ($, UI) {

  function ReactionTimeGame(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  }

  ReactionTimeGame.prototype.createShapeArray = function () {
    const that = this;

    let colors = ["red", "green", "blue", "black", "yellow"];
    let shapes = ["triangle", "circle", "square"];
    for (let i = 0; i < colors.length; i++) {
      this.randomColor = colors[Math.floor(Math.random() * colors.length)];
    }

    for(let i=0; i<shapes.length; i++) {
      this.randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    }

    if((that.selColor === that.randomColor) && (that.selShape === that.randomShape)) {
      if (that.correctColor.length<that.answerNum) {
        that.correctColor.push(this.randomColor);
        that.correctShape.push(this.randomShape);
      }
    }
    else {
      if (that.colorArray.length<(15-that.answerNum)) {
        if(that.colorArray[that.colorArray.length-1] !== this.randomColor) {
          that.colorArray.push(this.randomColor);
        }
      }

      if ((that.shapeArray.length<(15-that.answerNum))) {
        if(that.shapeArray[that.shapeArray.length-1] !== this.randomShape) {
          that.shapeArray.push(this.randomShape);
        }
      }

    }
    this.colors= that.colorArray.concat(this.correctColor);
    this.shapes= that.shapeArray.concat(this.correctShape);
    H5P.shuffleArray(this.colors);
    H5P.shuffleArray(this.shapes);
    // console.log(this.colors, this.shapes);
  };

  ReactionTimeGame.prototype.getShape = function (x) {
    const that = this;
    // console.log(this.shapes[x],this.colors[x]);
    this.shape = new ReactionTimeGame.Shape(this.shapes[x],this.colors[x]);
    this.createdTime = Date.now();
    this.shape.appendTo(that.$wrapper, this.canvasSize);
    $('<div class="reaction-time">Reaction Time &nbsp; :&nbsp;</div>').appendTo(that.$wrapper);
    this.shape.$canvas.click(function(){
      if((that.selColor === that.colors[x]) && (that.selShape === that.shapes[x])) {
        that.afterClickShape();
      }
    });
  };

  ReactionTimeGame.prototype.calculateAvgTime = function () {
    const that = this;
    this.total = 0;
    that.reactionTimes.forEach(function(time){
      that.total += time;
    });

    this.avgTime = that.total/that.reactionTimes.length;
    this.avgTime = this.avgTime.toFixed(3);
    console.log(this.avgTime.toFixed(3));
  };

  ReactionTimeGame.prototype.afterClickShape = function () {
    const that=this;
    // console.log(this.shape.$canvas);
    this.clickedTime = Date.now();
    this.reactionTime = (this.clickedTime - this.createdTime)/1000;
    if(this.reactionTime){
      that.reactionTimes.push(this.reactionTime);
      $(".reaction-time").append(this.reactionTime);
    }
    this.calculateAvgTime();
  };

  ReactionTimeGame.prototype.createFinalScreen = function () {
    const that = this;
    that.$wrapper.empty();
    $('<div class="message"><h1>Game Over!</h1></div>').appendTo(that.$wrapper);
    $('<div class="average-time">Average Reaction Time :&nbsp;'+that.avgTime+'</div>').appendTo(that.$wrapper);
    if(that.avgTime<=0.5) {
      $('<div class="feedback">Feedback : &nbsp Good!!</div>').appendTo(that.$wrapper);
    }
    else if ((that.avgTime<1)&&(that.avgTime>0.5)) {
      $('<div class="feedback">Feedback : &nbsp Need to improve!!</div>').appendTo(that.$wrapper);
    }
    else {
      $('<div class="feedback">Feedback : &nbsp Very Bad!! Are you sleeping??</div>').appendTo(that.$wrapper);
    }

  };

  ReactionTimeGame.prototype.startGame = function () {
    const that = this;
    this.canvasSize = window.innerWidth/3.5 ;
    this.answerNum = Math.floor(Math.random() * (4) + 3);
    this.correctColor = [];
    this.correctShape = [];
    this.colorArray = [];
    this.shapeArray = [];
    this.reactionTimes = [];
    let x = 0;
    while(this.correctColor.length+this.colorArray.length <15) {
      that.createShapeArray();
    }

    let a = setInterval(function(){
      x++;
      that.getShape(x);

      if(x === 14) {
        stopInerval();
      }
    },2000);

    function stopInerval() {
      clearInterval(a);
      that.createFinalScreen();
    }

  };

  ReactionTimeGame.prototype.attach = function ($container) {
    const that=this;
    this.selShape = this.options.shape;
    this.selColor = this.options.color;
    console.log(this.selColor,this.selShape);
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
