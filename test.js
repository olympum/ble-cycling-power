var bcp = require('./');

var peripheral = new bcp.BluetoothPeripheral('TestDevice');

console.log("[Init] Faking test data");

var stroke_count = 0;
var test = function() {
  var watts = Math.floor(Math.random() * 10 + 120);
  stroke_count = stroke_count + 1;
  peripheral.notify({'watts': watts, 'rev_count': stroke_count});
  setTimeout(test, 249);
};
test();
