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
