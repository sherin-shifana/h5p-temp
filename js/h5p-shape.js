(function ($,ReactionTimeGame) {

  ReactionTimeGame.Shape = function (shape, color) {
    this.shape = shape;
    this.color = color;
    this.count = 15;
    this.canvasSize = 100;
  };

  ReactionTimeGame.Shape.prototype.appendTo = function ($container, cSize) {
    this.canvasSize = cSize;
    console.log(cSize);
    console.log($container);
    $container.empty();
    this.$canvas = $('<canvas id="canvas" height="'+cSize+'px" width="'+cSize+'px"></canvas>');
    this.$canvas.appendTo($container);
    this.prepareCanvas();
    this.drawNext();
  };

  ReactionTimeGame.Shape.prototype.drawNext = function () {
    this.draw();
  };

  ReactionTimeGame.Shape.prototype.decrement = function () {
    this.count--;
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
      // triangle
        that.drawShape(this.unitWt*3,this.unitHt*1.5,this.color,this.shape,0,this.height/3,this.height/3);
        break;

      case 'square':
      // square
        that.drawShape(this.unitWt*2,this.unitHt*1.5,this.color,this.shape,0,this.height/3,this.height/3);
        break;

      case 'circle':
      // circle
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

  return ReactionTimeGame.Shape;
})(H5P.jQuery,H5P.ReactionTimeGame);
