(function (exports) {
  function Timer() {
    this.endTime = 0;
    this.timeLeft = 0;
    this.intervalId = null;
  }

  Timer.prototype = {
    setEndTime: function (time) {
      this.endTime = new Date().getTime() + time;
      this.updateTimeRemaining();
      this.startTimer();
    },
    setEndTimeFromServer: function (time) {
      this.endTime = time;
      this.updateTimeRemaining();
      this.startTimer();
    },
    updateTimeRemaining: function () {
      this.timeLeft = Math.max(0, this.endTime - new Date().getTime());
    },
    formatTime: function () {
      var time = this.timeLeft,
        seconds = Math.floor((time / 1000) % 60),
        minutes = Math.floor((time / (1000 * 60)) % 60),
        hours = Math.floor((time / (1000 * 60 * 60)) % 24);

      return (
        (hours > 0 ? (hours < 10 ? "0" + hours : hours) + ":" : "") +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds)
      );
    },
    startTimer: function () {
      var self = this;
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(function () {
        self.updateTimeRemaining();
        $("#timer").text(self.formatTime());
        if (self.timeLeft <= 0) {
          clearInterval(self.intervalId);
          self.showButtons();
        }
      }, 1000);
    },
    showButtons: function () {
      $("#buttons").fadeIn(1000, function () {
        $(".bid-btns").fadeIn(100);
      });
      $(".bid-btns").prop("disabled", false);
    },
  };

  exports.Timer = Timer;
})(typeof exports === "undefined" ? this : exports);

(function () {
  var timer = new Timer(),
    socket = io.connect("http://localhost:8080");

  socket.on("currentEndTime", function (data) {
    timer.setEndTimeFromServer(data.time);
  });

  $(function () {
    set = setInterval(function () {
      $(".time").trigger("change");
      clearInterval(set);
    }, 100);

    $(".time").on("change", function (e) {
      e.stopPropagation();
      var time = $(this).text() * 1000;
      timer.setEndTime(time);
      socket.emit("setTimer", { time: time });
    });
  });
})();
