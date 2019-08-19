(function (ReactionTimeGame) {

  /**
  * Keeps track of the number of times the game is submitted
  *
  * @class H5P.ReactionTimeGame.Counter
  * @param {H5P.jQuery} $container
  */
  ReactionTimeGame.Counter = function ($container) {

    /**
    * @alias H5P.ReactionTimeGame.Counter#
    */
    const that = this;
    let current = parseInt($container.text());
    console.log($container.text());

    /**
    * @private
    */
    const update = function () {
      $container[0].innerText = current;
    };

    /**
    * Increment the counter.
    */
    that.increment = function () {
      current++;
      update();
    };

    /**
    * Decrement the counter.
    */
    that.decrement = function () {
      if (current > 1) {
        current--;
      }
      update();
    };

    /**
    * Revert counter back to its natural state
    */
    that.gameStart = function () {
      current = 'Go!';
      update();
    };

    that.remove = function() {
      $container[0].remove();
    }
  };
})(H5P.ReactionTimeGame);
