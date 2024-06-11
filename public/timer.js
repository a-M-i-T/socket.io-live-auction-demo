import { Timer } from './lib/Timer.js';

  
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
  
