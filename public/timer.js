;(function (exports) {
	class Timer {
	  constructor() {
		this.endTime = 0;
		this.timeLeft = 0;
		this.intervalId = null;
	  }
  
	  setEndTime(time) {
		this.endTime = Date.now() + time;
		this.updateTimeRemaining();
		this.startTimer();
	  }
  
	  setEndTimeFromServer(time) {
		this.endTime = time;
		this.updateTimeRemaining();
		this.startTimer();
	  }
  
	  updateTimeRemaining() {
		this.timeLeft = Math.max(0, this.endTime - Date.now());
	  }
  
	  formatTime() {
		const time = this.timeLeft;
		const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
		const minutes = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
		const hours = Math.floor((time / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
  
		return `${hours > 0 ? hours + ':' : ''}${minutes}:${seconds}`;
	  }
  
	  startTimer() {
		if (this.intervalId) {
		  clearInterval(this.intervalId);
		}
  
		this.intervalId = setInterval(() => {
		  this.updateTimeRemaining();
		  document.getElementById('timer').textContent = this.formatTime();
		  if (this.timeLeft <= 0) {
			clearInterval(this.intervalId);
			this.showButtons();
		  }
		}, 1000);
	  }
  
	  showButtons() {
		const buttons = document.getElementById('buttons');
		buttons.style.display = 'block';
		const bidBtns = document.querySelectorAll('.bid-btns');
		bidBtns.forEach(btn => {
		  btn.style.display = 'block';
		  btn.disabled = false;
		});
	  }
	}
  
	exports.Timer = Timer;
  })(typeof exports === "undefined" ? this : exports);
  
  (function () {
	const timer = new Timer();
	const socket = io.connect("http://localhost:8080");
  
	socket.on("currentEndTime", (data) => {
	  timer.setEndTimeFromServer(data.time);
	});
  
	document.addEventListener('DOMContentLoaded', () => {
	  const timeElements = document.querySelectorAll('.time');
  
	  setTimeout(() => {
		timeElements.forEach(el => el.dispatchEvent(new Event('change')));
	  }, 100);
  
	  timeElements.forEach(el => {
		el.addEventListener('change', (e) => {
		  e.stopPropagation();
		  const time = parseInt(el.textContent, 10) * 1000;
		  timer.setEndTime(time);
		  socket.emit("setTimer", { time });
		});
	  });
	});
  })();
  
