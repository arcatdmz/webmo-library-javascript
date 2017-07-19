
var lib = require('./');
var host = '192.168.42.1';

function testWebSocket(cb) {
  var wws = lib.ws;
  var motor = new wws(host);
  console.log('testing websocket client ...');
  motor.onopen = () => {
    motor.rotate(90);
    setTimeout(() => { motor.stop(); motor.close(); if (cb) cb(); }, 2000);
  };
}

function testHttp(cb) {
  var whttp = lib.http;
  var motor = new whttp(host);
  console.log('testing http client ...');
  motor.rotate(-90)
  .then(() => {
    setTimeout(() => {
      motor.stop()
      .then(() => {
        if (cb) cb();
      });
    }, 2000);
  });
}

// first, test the WebSocket client
testWebSocket(() => {

  // second, test the HTTP client
  testHttp();

});
