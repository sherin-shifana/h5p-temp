H5P.ReactionTimeGame = (function ($, UI) {

  function ReactionTimeGame(options, id) {
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">');
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  }

  ReactionTimeGame.prototype.attach = function ($container) {
    const that = this;
    this.selColor = this.options.color;
    this.selShape = this.options.shape;
    this.taskDescription = this.options.taskDescription;
    this.count = 0;
    this.introPage = new that.createIntroPage($container);

    if (this.$container === undefined) {
        this.$container = $container;
        this.$container.addClass('h5p-reaction-game');
        this.introPage.appendTo(this.$container);
        this.introPage.$introPage.on('start-game', function() {
          $(this).remove();
          that.createGamePage(that.$container);
        });

        this.trigger('resize');
    }
  };

  ReactionTimeGame.prototype.createIntroPage = function () {
    const that = this;
    this.$introPage = $('<div>', {
      'class': 'h5p-intro-page'
    });

    var $innerWrapper = $('<div>', {
      'class': 'h5p-intro-page-inner'
    });

    $innerWrapper.append($('<div>', {
      'class': 'h5p-intro-page-title'
    }).append($('<span>')));

    UI.createButton({
      text: 'Start',
      'class': 'mq-control-button',
      click: function () {
        $(this).trigger('start-game');
      }
    }).appendTo($innerWrapper);

    $innerWrapper.appendTo(this.$introPage);
    that.appendTo = function ($container) {
      this.$introPage.appendTo($container);
    };

    that.remove = function () {
      this.$introPage.remove();
    };
  };

  ReactionTimeGame.prototype.createGamePage = function ($container) {
    const that = this;
    that.sliding = false;
    this.translations = this.options.userInterface;
    that.$gamepage = $('<div>', {
      'class': 'h5p-game'
    });

    that.$counterDiv = $('<div class="counting-down">5</div>');

    that.score = 0;
    that.$counterDiv.appendTo(that.$gamepage);
    this.$gamepage.appendTo($container);
    this.counter = new ReactionTimeGame.Counter(that.$counterDiv);

    let a = setInterval(function() {
      that.count++;
      that.counter.decrement();
      if(that.count===5) {
       that.counter.gameStart();
      }
      else if (that.count>5) {
        removeInerval();
      }
    },1000);
    function removeInerval() {
      clearInterval(a);
      that.counter.remove();
      that.startGame(that.$gamepage);
    }
  };

  ReactionTimeGame.prototype.startGame = function ($container) {
    const that = this;
    this.$wrapper = $container;
    this.$questionDiv = $('<div class="question-container"><p>'+that.taskDescription+'</p><p>Shape : '+that.selShape+'</p> <p>Color : '+that.selColor+'</p></div>');
    this.canvasSize = window.innerWidth/3.5 ;
    this.answerNum = Math.floor(Math.random() * (7) + 3);
    this.totalAppearance = 15;
    this.correctColor = [];
    this.correctShape = [];
    this.colorArray = [];
    this.shapeArray = [];
    this.reactionTimes = [];
    this.correct = 0;
    this.wrong = 0;
    this.missed = 0;
    this.$questionDiv.appendTo(this.$wrapper);
    let x = 0;
    for(let i=(this.correctColor.length+this.colorArray.length); i <this.totalAppearance; i++) {
      that.createShapeArray();
    }

    this.interval = setInterval(function(){
      x++;
      that.getShape(x);
    },2000);

  };

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

    if ((that.selColor === that.randomColor) && (that.selShape === that.randomShape)) {
      for (let i=that.correctColor.length; i<that.answerNum;i++) {
        that.correctColor.push(this.randomColor);
        that.correctShape.push(this.randomShape);
      }
    }
    else {
      if (that.colorArray.length<=(that.totalAppearance-that.answerNum)) {
        // if(that.colorArray[that.colorArray.length-1] !== this.randomColor) {
          that.colorArray.push(this.randomColor);
        // }
      }

      if ((that.shapeArray.length<(that.totalAppearance-that.answerNum))) {
        // if(that.shapeArray[that.shapeArray.length-1] !== this.randomShape) {
          that.shapeArray.push(this.randomShape);
        // }
      }
    }

    this.colors= that.colorArray.concat(this.correctColor);
    this.shapes= that.shapeArray.concat(this.correctShape);
    H5P.shuffleArray(this.colors);
    H5P.shuffleArray(this.shapes);
  };

  ReactionTimeGame.prototype.getShape = function (x) {
    const that = this;
    this.shape = new ReactionTimeGame.Shape(this.shapes[x],this.colors[x]);
    this.createdTime = Date.now();

    that.$questionDiv.appendTo(that.$wrapper);
    this.shape.appendTo(that.$wrapper, this.canvasSize);
    this.shape.$question.append("Question : "+that.selColor + " " + that.selShape);
    $('<div class="reaction-time">Reaction Time &nbsp; :&nbsp;</div>').appendTo(that.$wrapper);
    // this.shape.$canvas.attr('aria-label','shape');
    this.shape.$canvas.click(function(){
      $(this).attr('aria-label','clicked');
      that.afterClickShape(x);
    });
    if(x > this.totalAppearance) {
      stopInerval();
    }
    function stopInerval() {
      clearInterval(that.interval);
      that.createFinalScreen();
    }
  };

  ReactionTimeGame.prototype.afterClickShape = function (x) {
    const that=this;
    // that.clickStatus = 0;
    that.shape.$canvas.off('click');
    if((that.selColor === that.colors[x]) && (that.selShape === that.shapes[x])) {
      that.correct++;
      this.clickedTime = Date.now();
      this.reactionTime = (this.clickedTime - this.createdTime)/1000;
      if(this.reactionTime){
        that.reactionTimes.push(this.reactionTime);
        $(".reaction-time").append(this.reactionTime);
      }
    }
    else {
      that.shape.$message.append("wrong attempt!!");
      that.wrong++;
    }

    this.calculateAvgTime();
  };

  ReactionTimeGame.prototype.calculateAvgTime = function () {
    const that = this;
    this.total = 0;
    that.reactionTimes.forEach(function(time){
      that.total += time;
    });

    this.avgTime = that.total/that.reactionTimes.length;
    this.avgTime = this.avgTime.toFixed(3);
    // console.log(this.avgTime.toFixed(3));
  };

  ReactionTimeGame.prototype.createFinalScreen = function () {
    const that = this;
    that.$wrapper.empty();
    if (!that.avgTime) {
      that.avgTime = 0;
    }
    this.missed = (that.totalAppearance - that.correct - that.wrong);
    if(that.avgTime<=0.5 && that.avgTime>0) {
      $('<h3 class="feedback">Good!!</h3>').appendTo(that.$wrapper);
    }
    else if ((that.avgTime<1)&&(that.avgTime>0.5)) {
      $('<h3 class="feedback">Need to improve!!</h3>').appendTo(that.$wrapper);
    }
    else {
      $('<h3 class="feedback">Very Bad!! Are you sleeping??</h3>').appendTo(that.$wrapper);
    }
    $('<p class="average-time">Average Reaction Time :&nbsp;'+that.avgTime+'</p>').appendTo(that.$wrapper);
    $('<p class="correct-attempts">Correct Attempts :&nbsp;'+that.correct+'</p>').appendTo(that.$wrapper);
    $('<p class="wrong-aatempts">Wrong Attempts :&nbsp;'+that.wrong+'</p>').appendTo(that.$wrapper);
    $('<p class="wrong-aatempts">Missed Attempts :&nbsp;'+that.missed+'</p>').appendTo(that.$wrapper);

  };

  return ReactionTimeGame;
})(H5P.jQuery, H5P.JoubelUI);
