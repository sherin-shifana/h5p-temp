(function (ReactionTimeGame, Timer) {

  /**
   * ReactionTimeGame.Timer - Adapter between Find the words and H5P.Timer.
   * @class H5P.ReactionTimeGame.Timer
   * @extends H5P.Timer
   * @param {H5P.jQuery} $element
   */
  ReactionTimeGame.Timer = function () {
    /** @alias H5P.ReactionTimeGame.Timer# */
    const that = this;
    // Initialize event inheritance
    Timer.call(that);


    /** @private {string} */
    const naturalState = '0:00';

    /**
     * update - Set up callback for time updates.
     * Formats time stamp for humans.
     *
     * @private
     */
    const update = function () {
      const time = that.getTime();

      const minutes = Timer.extractTimeElement(time, 'minutes');
      let seconds = Timer.extractTimeElement(time, 'seconds') % 60;
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      // console.log(time);
      // $element.text(minutes + ':' + seconds);
    };

    that.notify({ "type": H5P.Timer.TYPE_PLAYING,
     // "calltime": 10000,
     "repeat": 1000,
     "mode": H5P.Timer.NOTIFIY_RELATIVE
    }, function() {
       // console.log(that.getTime());
       // console.log('triggering update');
       // console.log(that.getStatus());
      } );


      that.notify({ "type": H5P.Timer.TYPE_PLAYING,
       "calltime": "0:04",
       "mode": H5P.Timer.NOTIFIY_RELATIVE
      }, function() {
         // console.log(that.getTime());
         // console.log('End');
         that.stop();
         that.trigger('skipped');
         // console.log(that.getStatus());
        } );


    // that.notify({
    //   "repeat": -1000,
    //   "mode": H5P.Timer.NOTIFY_RELATIVE
    // },function(){
    //   console.log('stopped');
    // });
    // Setup default behavior
    that.notify('every_tenth_second', update);
    that.on('reset', function () {
      $element.text(naturalState);
      that.notify('every_tenth_second', update);
    });
  };

  // Inheritance
  ReactionTimeGame.Timer.prototype = Object.create(Timer.prototype);
  ReactionTimeGame.Timer.prototype.constructor = ReactionTimeGame.Timer;

}) (H5P.ReactionTimeGame, H5P.Timer);
