$(function() {

  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $rightLogMsg = $('.right .logs'); //User Logs
  var $allBidLogs = $('.all-bid-logs');
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  var $btns = $('.bid-btns'); // bidding buttons @ footer

  // Prompt for setting a username
  var username;
  var connected = false;
  var bidding = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  function addParticpantBidders (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 bidder";
    } else {
      message += "there are " + data.numUsers + " bidders";
    }
    log(message);
    //AA@MI [add initial bidding price by default]
    //$('.messages').append('<li class="message show" style="display: list-item;"><span style="color: #000;">Current Bidding @ </span><span class="messageBody">99</span></li>');
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }
  
  //ADDED LATER AA@MI[5/19/2017]
  function bid (c) {

    var now = moment().format("DD-M-YYYY, h:mm:ss SSS a");
    var init_bid_condition = parseInt(c) == 99 ? 0 : parseInt(c);

    var init_bid_amt = parseInt($('.init-bid').text(),10);
    var data_init_bid_amt = $('.init-bid').data('init-bid');
    var latest_bid_amt = parseInt($('.show:last-child').find('.messageBody').text(),10);
    var bid_amt_condition = data_init_bid_amt == 99 ? init_bid_amt : latest_bid_amt;

    //var message =  parseInt(c) + parseInt($('.show:last-child').find('.messageBody').text()) + ' ['+now+']';
    var message =  init_bid_condition + bid_amt_condition + ' ['+now+']';
    //remove initial bid amt from data on first bid
    $('.init-bid').data('init-bid',0);
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addBids({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addBiddingElements($el, options);
  }

  // Adds the visual chat message to the message list
  function addBids (data, options) {
    // Don't fade the message in if there is an 'X was bidding'
    var $biddingMessages = getBiddings(data);
    options = options || {};
    if ($biddingMessages.length !== 0) {
      options.fade = false;
      $biddingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var biddingClass = data.bidding ? 'bidding' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(biddingClass)
      .append($usernameDiv, $messageBodyDiv);

    addBiddingElements($messageDiv, options,data);
  }

  // Adds the visual chat bidding message
  function addBiddersBidding (data) {
    data.bidding = true;
    data.message = 'is bidding';
    addBids(data);
  }

  // Removes the visual chat bidding message
  function removingBiddingState (data) {
    getBiddings(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addBiddingElements (el, options, data) {
 
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if(el.hasClass('message')){
      $messages.append($el);

      //for right col
      var $usernameDiv = $('<span class="username"/>')
        .text(data.username)
        .css('color', getUsernameColor(data.username));
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);

      var biddingClass = data.bidding ? 'bidding' : '';
      var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .addClass(biddingClass)
        .append($usernameDiv, $messageBodyDiv);

      $allBidLogs.prepend($messageDiv);
    }else{
      $rightLogMsg.append($el);
    }
    // if (options.prepend == false) {
    //   console.log($el);
    //   $messages.prepend($el);
    // } else {
    //   console.log($el);
    //   $rightLogMsg.append($el);
    // }
    
    //AA@MI [ADDED[dipslay only 2 bidders at a time]]
    $(".messages").each(function(){
         //$(this).find("li:lt(3)").show();
         $(this).find('li').hide();
         $(this).find('li').removeClass('show');
         $(this).find('li:last-child').prev('li').andSelf().show();
         $(this).find('li:last-child').prev('li').andSelf().addClass('show');
         //$(this).find('li').not('.show').hide();  
         $(this).find('li').not('.show').remove();  
      });

    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the bidding event
  function updateBidding () {
    if (connected) {
      if (!bidding) {
        bidding = true;
        socket.emit('bidding');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var biddingTimer = (new Date()).getTime();
        var timeDiff = biddingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && bidding) {
          socket.emit('stop bidding');
          bidding = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is bidding' messages of a user
  function getBiddings (data) {
    return $('.bidding.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  //Added later
  function setTimer(){
    var interval = setInterval(function() {
        var timer = $('#timer').html();
        timer = timer.split(':');
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        seconds -= 1;
        if (minutes < 0) return clearInterval(interval);
        if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
        if (seconds < 0 && minutes != 0) {
            minutes -= 1;
            seconds = 59;
        }
        else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;
        $('#timer').html(minutes + ':' + seconds);
        
        if (minutes == 0 && seconds == 0)
            clearInterval(interval);
    }, 1000);
    //alert('You have '+timer.textContent+' to bid for current item.');
  }

  function strikeInitialBid (bid_value){
   console.log(bid_value);
   $('p span:contains(99)').next().prop('disabled',true);
   $('p span:contains(99)').css("text-decoration", "line-through");
  }

  function disableInitBidAmt (bid_value) {
    //disable click for yourself / strike through initial bid amount 
    $('p span:contains(99)').next().prop('disabled',true);
    $('p span:contains(99)').css("text-decoration", "line-through");
    // tell server to execute 'new message' and send along one parameter
    socket.emit('strike initial bid price', bid_value);
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        //sendMessage();
        socket.emit('stop bidding');
        bidding = false;
      } else {
        setUsername();
      }
    }
  });

  // $inputMessage.on('input', function() {
  //   updateBidding();
  // });

      $window.keypress(function(k) {

      if($('.bid-btns').eq(1).prop('disabled') === true){
        if(k.keyCode == 48 || k.keyCode == 49 || k.keyCode == 50 || k.keyCode == 51 || k.keyCode == 52 || k.keyCode == 53)
        return false;
      }
      //AA@MI [disable num pad 0 if bidders have already bidded the initial price]
      if($('.bid-btns:contains(0)').prop('disabled') == true){
        if(k.keyCode == 48){
          return false;
        }
      }

      switch(k.keyCode)
      {
          // user presses the "0"
          case 48:  bid(99); updateBidding(); disableInitBidAmt(99);
          break;

          // user presses the "1"
          case 49:  bid(100); updateBidding(); disableInitBidAmt(100);
          break;
              
          // user presses the "2"
          case 50:  bid(200); updateBidding(); disableInitBidAmt(200);
          break;
          
          // user presses the "3"
          case 51:  bid(300); updateBidding(); disableInitBidAmt(300);
          break;
          
          // user presses the "4"
          case 52:  bid(400); updateBidding(); disableInitBidAmt(400);
          break;
          
          // user presses the "5"
          case 53:  bid(500); updateBidding(); disableInitBidAmt(500); 
          break;
      }
      });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  //AA@MI[Bid on button click]
  $btns.click(function(){
    var me = $(this);
    var bid_value = me.prev('span').text();
    bid(bid_value);
    //disable click for yourself / strike through initial bid amount 
    disableInitBidAmt(bid_value);
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Live Auction Demo MI – ";
    log(message, {
      prepend: true
    }); 
    addParticpantBidders(data);
    //setTimer();
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addBids(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticpantBidders(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticpantBidders(data);
    removingBiddingState(data);
  });

  // Whenever the server emits 'bidding', show the bidding message
  socket.on('bidding', function (data) {
    addBiddersBidding(data);
  });

  // Whenever the server emits 'stop bidding', kill the bidding message
  socket.on('stop bidding', function (data) {
    removingBiddingState(data);
  });

  socket.on('disconnect', function () {
    log('you have been disconnected');
  });

  socket.on('reconnect', function () {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });

  socket.on('strike initial bid price', function (bid_value) {
    strikeInitialBid(bid_value);
  });

});