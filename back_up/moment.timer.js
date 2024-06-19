<div class="eventTime"></div>
<div class="currentTime"></div>
<div class="countdown"></div>


// /for days hour min sec
var eventTime= moment().set({'year': 2017, 'month': 5, 'date':1, 'hour':15,'minute':00,'second':00}); // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
var currentTime = moment(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
$('.eventTime').text('deadline: ' + eventTime.format('MMMM Do YYYY, h:mm:ss a'));
$('.currentTime').text('now: ' + currentTime.format('MMMM Do YYYY, h:mm:ss a'));

var diffTime = eventTime - currentTime;
//alert(diffTime.format('h:mm:ss'));
var duration = moment.duration(diffTime, 'milliseconds');
var interval = 1000;
//duration = moment.duration(diffTime - interval, 'milliseconds');
setInterval(function(){
  duration = moment.duration(duration - interval, 'milliseconds');  
  $('.countdown').text(duration.days() + "(day)" + duration.hours() + "(hr)" + duration.minutes() + "(min)" + duration.seconds() +"(sec)");
  console.log(duration);
}, interval);

// for hour min sec
var eventTime= moment().set({'hour':15,'minute':00,'second':00}); // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
var currentTime = moment(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
$('.eventTime').text('deadline: ' + eventTime.format('MMMM Do YYYY, h:mm:ss a'));
$('.currentTime').text('now: ' + currentTime.format('MMMM Do YYYY, h:mm:ss a'));

var diffTime = eventTime - currentTime;
//alert(diffTime.format('h:mm:ss'));
var duration = moment.duration(diffTime, 'milliseconds');
var interval = 1000;
//duration = moment.duration(diffTime - interval, 'milliseconds');
setInterval(function(){
  duration = moment.duration(duration - interval, 'milliseconds');  
  $('.countdown').text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
  console.log(duration);
}, interval);