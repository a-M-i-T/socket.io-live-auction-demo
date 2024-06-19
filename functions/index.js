// Setup basic express server
var express = require("express");
const serverless = require("serverless-http");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 8080;
(Timer = require("../timer.js").Timer), (timer = new Timer());

server.listen(port, function () {
  console.log("Server listening at port %d", port);
});

// Routing
app.use(express.static(__dirname + "/public"));

module.exports.handler = serverless(app);

// number of users
var numUsers = 0;

io.on("connection", function (socket) {
  var addedUser = false;

  socket.on("setTimer", function (data) {
    timer.setEndTime(data.time);
    socket.broadcast.emit("currentEndTime", { time: timer.getEndTime() });
  });

  // when the client emits 'new message', this listens and executes
  socket.on("new message", function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data.message,
      bid_sold_at: data.bid_sold_at,
    });
  });

  // when the client emits 'strike initial bid price', this listens and executes
  socket.on("strike initial bid price", function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit("strike initial bid price", {
      me: data,
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", function () {
    socket.broadcast.emit("typing", {
      username: socket.username,
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", function () {
    socket.broadcast.emit("stop typing", {
      username: socket.username,
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });
});
