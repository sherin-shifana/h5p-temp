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
    this.count = 0;
    this.introPage = new that.createIntroPage($container);
    // this.gamePage = new that.createGamePage(that.options,that.id);

    if (this.$container === undefined) {
        this.$container = $container;
        that.addFont();
        this.$container.addClass('h5p-reaction-game');
        this.introPage.appendTo(this.$container);
        console.log(this.introPage.$introPage.on());
        this.introPage.$introPage.on('start-game', function() {
          $(this).remove();
          that.createGamePage(that.$container);
        });

        this.trigger('resize');
    }
  };

  ReactionTimeGame.prototype.startGame = function ($container) {
    const that = this;
    this.$wrapper = $container;
    this.canvasSize = window.innerWidth/3.5 ;
    this.answerNum = Math.floor(Math.random() * (4) + 3);
    this.correctColor = [];
    this.correctShape = [];
    this.colorArray = [];
    this.shapeArray = [];
    this.reactionTimes = [];
    let x = 0;
    for(let i=(this.correctColor.length+this.colorArray.length); i <15; i++) {
      that.createShapeArray();
    }
    
    let interval = setInterval(function(){
      x++;
      that.getShape(x);

      if(x === 14) {
        stopInerval();
      }
    },2000);

    function stopInerval() {
      clearInterval(interval);
      that.createFinalScreen();
    }
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
    this.shape = new ReactionTimeGame.Shape(this.shapes[x],this.colors[x]);
    this.createdTime = Date.now();
    console.log(that.$wrapper);
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
    that.$wrapper.remove();
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

  ReactionTimeGame.prototype.addFont = function () {
      window.WebFontConfig = {
        google: { families: [ 'Lato::latin' ] }
      };

      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
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
    }).append($('<span>', {
      // html: text
    })));

    UI.createButton({
      text: 'Start',
      'class': 'mq-control-button',
      click: function () {
        // console.log($(this));
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
      console.log(that.count);
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
      // console.log(that.$gamepage[0]);
      that.startGame(that.$gamepage);
    }
  };

  return ReactionTimeGame;
})(H5P.jQuery, H5P.JoubelUI);
