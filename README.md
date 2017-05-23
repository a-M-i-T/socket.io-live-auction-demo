# socket.io-live-auction-demo
demo live auction built with node.js

A simple demo for socket.io

## How to use

```
$ cd socket.io
$ npm install
$ cd live_auction
$ npm install
$ npm start or node index
```

And point your browser to `http://localhost:8080`. Optionally, specify
a port by supplying the `PORT` env variable.

## Features

- Multiple bidders can join the auction by each entering a unique username
on website load.
- Bidders can bid to auction using num pad keys.
- A notification is sent to all bidders when a bidder joins or leaves
the acution.

## TODO-LISTS
- realtime product list display slideshow in certain time interval
- countdown timer for last bidder