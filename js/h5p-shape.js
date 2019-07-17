(function ($,ReactionTimeGame) {

  ReactionTimeGame.Shape = function (shape, color) {
    this.shape = shape;
    this.color = color;
    // this.occurance = 15;
    // this.currentState = 15;
    this.canvasSize = 100;
    console.log(this.shape, this.color);
  };

  ReactionTimeGame.Shape.prototype.appendTo = function ($container, cSize) {
    this.canvasSize = cSize;
    $container.empty();
    this.$canvas = $('<canvas id="canvas" height="'+cSize+'px" width="'+cSize+'px"></canvas>').appendTo($container);
    this.prepareCanvas();
    this.drawNext();
  };

  ReactionTimeGame.Shape.prototype.drawNext = function () {
    this.draw();
    // this.currentState--;
  };

  ReactionTimeGame.Shape.prototype.prepareCanvas = function () {
    const that = this;
    this.canvas = this.$canvas[0];
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.unitHt = this.height / 6;
    this.unitWt = this.width / 6;
    this.unit = 2;
    this.radius = this.canvasSize/5;
    this.gap = (this.canvasSize/50 < 5)?5: Math.floor(this.canvasSize/50);
    this.pos = this.canvasSize - this.gap;
  };

  ReactionTimeGame.Shape.prototype.drawShape = function (pathFromX, pathFromY,color, shape, radius, height, width ) {
    const context = this.canvas.getContext('2d');
    context.strokeStyle = color;
    context.fillStyle = color;
    // context.lineWidth = lineWidth;
    context.beginPath();
    switch(shape) {
      case 'triangle':
        context.moveTo(pathFromX, pathFromY);
        context.lineTo(pathFromX + (width/2), pathFromY + height);
        context.lineTo(pathFromX - (width/2), pathFromY+ height);
        break;

      case 'square':
        context.fillRect(pathFromX, pathFromY, width, height);
        break;

      case 'circle':
        context.arc(pathFromX, 4*pathFromY, radius, 0, 2 * Math.PI);
        break;
      }

    context.stroke();
    context.fill();
    context.closePath();
  };

  ReactionTimeGame.Shape.prototype.draw = function () {
    const that = this;
    switch (this.shape) {
      case 'triangle':
      //frame1
        that.drawShape(this.unitWt*3,this.unitHt*1.5,this.color,this.shape,0,this.height/3,this.height/3);
        break;

      case 'square':
      // frame2
        that.drawShape(this.unitWt*2,this.unitHt*1.5,this.color,this.shape,0,this.height/3,this.height/3);
        break;

      case 'circle':
      //frame3
        that.drawShape(this.unitWt*3,this.unitHt/1.5,this.color,this.shape,this.radius,0,0);
        break;
      }
  };

  ReactionTimeGame.Shape.prototype.clearCanvas = function () {
    const context = this.canvas.getContext('2d');
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  /**
  * If the selected level is less then 10, then draw initial parts
  */
  // ReactionTimeGame.Shape.prototype.drawFirst = function () {
  //   this.currentState = 10;
  //   while (this.currentState > this.numParts) {
  //     this.drawNext();
  //   }
  // };

  /**
  *
  */
  // ReactionTimeGame.Shape.prototype.redraw = function (attemptsLeft) {
  //   while (this.currentState > attemptsLeft) {
  //     this.drawNext();
  //   }
  // };

  return ReactionTimeGame.Shape;
})(H5P.jQuery,H5P.ReactionTimeGame);
