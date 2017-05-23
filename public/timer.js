;(function(exports) {

	function Timer() {
		this.endTime = new Date().getTime();
	}

	Timer.prototype = {

		setEndTime: function(time) {
			this.endTime = new Date().getTime() + time;
		},
		setEndTimeFromServer: function(time) {
			this.endTime = time;
			this.timeRemaining();
		},
		timeRemaining: function() {
			this.timeLeft = this.endTime - new Date().getTime();
		},
		format: function() {
			var time = this.timeLeft,
				seconds = Math.floor((time / 1000) % 60),
				minutes = Math.floor((time / (1000 * 60)) % 60),
				hours = Math.floor((time / (1000 * 60 * 60)) % 24);

			var formattedTime = "";
			if (hours > 0 && hours < 10) {
				formattedTime += "0" + hours + ":";
			} else if (hours >= 10) {
				formattedTime += hours + ":";
			}

			if (seconds < 0 && minutes != 0) {
			    minutes -= 0;
			    seconds = 0;
			}
			if (minutes < 10) {
				formattedTime += "0" + minutes + ":";
			} else {
				formattedTime += minutes + ":";
			}

			if (seconds < 10) {
				formattedTime += "0" + seconds;
			} else {
				formattedTime += seconds;
			}

			return formattedTime;
		}
	};

	exports.Timer = Timer;

})(typeof exports === 'undefined' ? this : exports);

;(function() {

	var timer = new Timer(),
		socket = io.connect('http://localhost:8080');
	
	socket.on('currentEndTime', function (data) {
		//this is the full date time in ms.
		timer.setEndTimeFromServer(data.time);
	});

	$(function() {

		//AA[alert user about the auction start time]
		// var millisecondVal = $('.time').text() * 60 * 1000;
		// var minuteVal = millisecondVal / 60000;
		// alert('Auction will start in '+minuteVal+' minutes. Please Wait...');
		// console.log(timer.timeRemaining());

		// var user="5/18/2017/6/50";
		// var arrdt= user.split("/");
		// var userdt = new Date(arrdt[2], arrdt[1] - 1, arrdt[0],arrdt[3],arrdt[4]);
		// var currdt = new Date();
		// if (userdt === currdt) {
		// alert("time bhayo");
		// }

		//AA[set auction start time]
		set = setInterval(function(){
			$('.time').trigger('click');
			clearInterval(set);
		},20000);
		//AA[clear interval once broadcasted]

		$('.time').on('click', function(e) {
			e.stopPropagation();
			var time = $(this).text() * 60 * 1000;
			timer.setEndTime(time);
			timer.timeRemaining();
			socket.emit('setTimer', { time: time });
		});
	});

	setInterval(function() {
		if (timer.timeLeft > 0) {
			timer.timeRemaining();
			$('#timer').text(timer.format());
		}
	},100);

})();