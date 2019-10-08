H5P.ReactionTimeGame = (function ($, UI) {

  function ReactionTimeGame(options, id) {
    this.options = options;
    this.id = id;
    this.colors = ['red','green','blue','black','yellow'];
    this.shapes = ['triangle','circle','square'];

    this.maxOptions=15; //option in semantics
    this.maxAnswers= 9; //option in semantics
    this.minAnswers= 6; //option in semantics with minimum value
    this.maxTime = 2000;

    this.shapesArray = [];

    this.answer = { 'color': this.options.color, 'shape': this.options.shape};

    this.createShapesArray();

    // TODO: need to add shuffling
  }

  ReactionTimeGame.prototype.createShapesArray = function(){

    const that = this;
    let correctAnswerCount = 0;

    while(correctAnswerCount < that.minAnswers){
      //push the correct answers first..for efficiency
      that.shapesArray.push( new ReactionTimeGame.Shape(Object.assign({},that.answer,{'isAnswer':true})));
      correctAnswerCount++;
    }

    while(that.shapesArray.length< that.maxOptions){

      let isAnswer = false;
      let rColor = that.colors[Math.floor(Math.random()* that.colors.length)];
      let rShape = that.shapes[Math.floor(Math.random()* that.shapes.length)];

      if(that.answer['color'] === rColor && that.answer['shape'] === rShape){
         isAnswer = true;
         correctAnswerCount++;
      }

      if(correctAnswerCount > that.maxAnswers && isAnswer) continue;

      that.shapesArray.push(new ReactionTimeGame.Shape({'color': rColor, 'shape': rShape, 'isAnswer':isAnswer}));
    }
  }

  ReactionTimeGame.prototype.startGame = function () {

    const that = this;
    H5P.shuffleArray(that.shapesArray);
    that.prepareGameArea();
    this.currentShapeIndex = 0;

    that.drawShape();

    // this.canvasSize = window.innerWidth/3.5 ;
    // this.answerNum = Math.floor(Math.random() * (4) + 3);
    // this.correctColor = [];
    // this.correctShape = [];
    // this.colorArray = [];
    // this.shapeArray = [];
    // this.reactionTimes = [];
    // let x = 0;
    // while(this.correctColor.length+this.colorArray.length <15) {
    //   that.createShapeArray();
    // }
    //
    // let a = setInterval(function(){
    //   x++;
    //   that.getShape(x);
    //
    //   if(x === 14) {
    //     stopInerval();
    //   }
    // },2000);
    //
    // function stopInerval() {
    //   clearInterval(a);
    //   that.createFinalScreen();
    // }

    //initialize another timer also
  };


  ReactionTimeGame.prototype.prepareGameArea =  function(){

    this.canvasSize = window.innerWidth/3.5 ;
    // this.unitHt = this.height / 6;
    // this.unitWt = this.width / 6;
    // this.unit = 2;
    // this.radius = this.canvasSize/5;
    // this.gap = (this.canvasSize/50 < 5)?5: Math.floor(this.canvasSize/50);
    // this.pos = this.canvasSize - this.gap;
    this.$gameContainer = $('<div class="game-container"></div>').appendTo(this.$wrapper);
    this.$canvas = $('<canvas height="'+this.canvasSize+'px" width="'+window.innerWidth*0.75+'px"></canvas>').appendTo(this.$gameContainer);
    this.$buttonContainer = $('<div class="button"></div>').appendTo(this.$gameContainer);

  }

  ReactionTimeGame.prototype.drawShape = function(){

    const that = this;

    console.log(that.currentShapeIndex);
    console.log(that.shapesArray);

    that.currentShape =   that.shapesArray[that.currentShapeIndex];
    that.currentShape.draw(that.$canvas, that.$container);

    that.$buttonContainer.empty();
    that.$correctButton = $('<button class="score-button '+(that.currentShape.isAnswer)+'-answer" >Correct</button>').appendTo(that.$buttonContainer);
    that.$inCorrectButton = $('<button class="score-button '+(!that.currentShape.isAnswer)+'-answer">Wrong</button>').appendTo(that.$buttonContainer);

    that.$buttonContainer.appendTo(that.$gameContainer);


    that.currentShapeIndex++;

    that.currentShape.on('drawNext',function(){
      console.log('coming');
      that.drawNext();
    });

    that.currentShape.on('attempted',function(e,isCorrect){
      console.log(isCorrect);
      that.drawNext();
      that.$correctButton.addClass('disabled');
      that.$inCorrectButton.addClass('disabled');
    });

    that.$buttonContainer.find('.score-button').on('click',function(){

      that.currentShape.timer.stop();

      // console.log(that.currentShape.timer.getTime());

      if($(this).hasClass('true-answer')){
        that.currentShape.status = 'correct';
      }
      else{
        that.currentShape.status = 'incorrect';
      }

      that.$correctButton.attr('disabled',true);
      that.$inCorrectButton.attr('disabled',true);
      that.drawNext();

    });





    // each shapes need to be an object, with shape,color,timer as properties
    // that.draw();




    // setTimeout(function(){
    //
    //   that.draw(that.currentItem);
    //
    //   that.$buttonContainer.empty();
    //   that.$correctButton = $('<button class="score-button '+(that.currentItem.isAnswer)+'-answer" >Correct</button>').appendTo(that.$buttonContainer);
    //   that.$inCorrectButton = $('<button class="score-button '+(!that.currentItem.isAnswer)+'-answer">Wrong</button>').appendTo(that.$buttonContainer);
    //
    //   that.$buttonContainer.appendTo(that.$gameContainer);
    //
    //
    //   if(that.currentItem < 14){
    //     that.currentItem = that.currentItem + 1;
    //     that.drawShapes();
    //   }
    // },2000);
  }

  // ReactionTimeGame.prototype.on('success', function(){
  //   alert('triggering');
  // });

  ReactionTimeGame.prototype.drawNext = function(){

    const that = this;

    if(that.currentShapeIndex < that.shapesArray.length){
      // adding some delay
      setTimeout(function(){
          that.drawShape();
      },2000);

    }
    else{
      that.$container.empty()
      that.appendFinalScreen(that.$container);
    }
  }

  ReactionTimeGame.prototype.appendFinalScreen = function($container){

    const that = this;

    $('<h1>Hello</h1>').appendTo($container);

    that.$list = $('<table />').appendTo($container);

    that.shapesArray.forEach(function(shape,index){
      $('<tr><td>'+index+'</td><td>'+shape.status+'</td>\
      <td>'+shape.timer.getTime()+'</td></tr>').appendTo(that.$list);
    });

  }

  ReactionTimeGame.prototype.attach = function ($container) {

    const that=this;
    const $shape = $('<p>Shape:&nbsp;'+this.answer['color']+'</p>');
    const $color = $('<p>Color:&nbsp'+this.answer['shape']+'</p>');
    const $taskDescription = $('<div class="task-description">'+this.options.taskDescription+'<br/></div>');
    const $startButton = $('<button class="start-button">Start</button>');

    // TODO: Start joubel ui & label from i10n


    that.$container = $container.addClass('h5p-reaction-time-game');
    this.$wrapper = $('<div class="wrapper"></div>');

    $taskDescription.appendTo(this.$wrapper);
    $shape.appendTo($taskDescription);
    $color.appendTo($taskDescription);
    $startButton.appendTo(this.$wrapper);
    this.$wrapper.appendTo($container);


    $startButton.click(function(){
      that.$wrapper.empty();
      that.startGame();
    });




  }






// unused code







  // ReactionTimeGame.prototype.createShapeArray = function () {
  //
  //   const that = this;
  //   let colors = ["red", "green", "blue", "black", "yellow"];
  //   let shapes = ["triangle", "circle", "square"];
  //   for (let i = 0; i < colors.length; i++) {
  //     this.randomColor = colors[Math.floor(Math.random() * colors.length)];
  //   }
  //
  //   for(let i=0; i<shapes.length; i++) {
  //     this.randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  //   }
  //
  //   if((that.selColor === that.randomColor) && (that.selShape === that.randomShape)) {
  //     if (that.correctColor.length<that.answerNum) {
  //       that.correctColor.push(this.randomColor);
  //       that.correctShape.push(this.randomShape);
  //     }
  //   }
  //   else {
  //     if (that.colorArray.length<(15-that.answerNum)) {
  //       if(that.colorArray[that.colorArray.length-1] !== this.randomColor) {
  //         that.colorArray.push(this.randomColor);
  //       }
  //     }
  //
  //     if ((that.shapeArray.length<(15-that.answerNum))) {
  //       if(that.shapeArray[that.shapeArray.length-1] !== this.randomShape) {
  //         that.shapeArray.push(this.randomShape);
  //       }
  //     }
  //
  //   }
  //   this.colors= that.colorArray.concat(this.correctColor);
  //   this.shapes= that.shapeArray.concat(this.correctShape);
  //   H5P.shuffleArray(this.colors);
  //   H5P.shuffleArray(this.shapes);
  //   // console.log(this.colors, this.shapes);
  // };

  // ReactionTimeGame.prototype.getShape = function (x) {
  //   const that = this;
  //   // console.log(this.shapes[x],this.colors[x]);
  //   this.shape = new ReactionTimeGame.Shape(this.shapes[x],this.colors[x]);
  //   this.createdTime = Date.now();
  //   this.shape.appendTo(that.$wrapper, this.canvasSize);
  //   $('<div class="reaction-time">Reaction Time &nbsp; :&nbsp;</div>').appendTo(that.$wrapper);
  //   this.shape.$canvas.click(function(){
  //     if((that.selColor === that.colors[x]) && (that.selShape === that.shapes[x])) {
  //       that.afterClickShape();
  //     }
  //   });
  // };
  //
  // ReactionTimeGame.prototype.calculateAvgTime = function () {
  //   const that = this;
  //   this.total = 0;
  //   that.reactionTimes.forEach(function(time){
  //     that.total += time;
  //   });
  //
  //   this.avgTime = that.total/that.reactionTimes.length;
  //   this.avgTime = this.avgTime.toFixed(3);
  //   console.log(this.avgTime.toFixed(3));
  // };
  //
  // ReactionTimeGame.prototype.afterClickShape = function () {
  //   const that=this;
  //   // console.log(this.shape.$canvas);
  //   this.clickedTime = Date.now();
  //   this.reactionTime = (this.clickedTime - this.createdTime)/1000;
  //   if(this.reactionTime){
  //     that.reactionTimes.push(this.reactionTime);
  //     $(".reaction-time").append(this.reactionTime);
  //   }
  //   this.calculateAvgTime();
  // };
  //
  // ReactionTimeGame.prototype.createFinalScreen = function () {
  //   const that = this;
  //   that.$wrapper.empty();
  //   $('<div class="message"><h1>Game Over!</h1></div>').appendTo(that.$wrapper);
  //   $('<div class="average-time">Average Reaction Time :&nbsp;'+that.avgTime+'</div>').appendTo(that.$wrapper);
  //   if(that.avgTime<=0.5) {
  //     $('<div class="feedback">Feedback : &nbsp Good!!</div>').appendTo(that.$wrapper);
  //   }
  //   else if ((that.avgTime<1)&&(that.avgTime>0.5)) {
  //     $('<div class="feedback">Feedback : &nbsp Need to improve!!</div>').appendTo(that.$wrapper);
  //   }
  //   else {
  //     $('<div class="feedback">Feedback : &nbsp Very Bad!! Are you sleeping??</div>').appendTo(that.$wrapper);
  //   }
  //
  // };
  return ReactionTimeGame;
})(H5P.jQuery, H5P.JoubelUI);
