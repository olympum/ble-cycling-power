var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Profile:
// https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.csc_feature.xml

var FeatureCharacteristic = function() {
  FeatureCharacteristic.super_.call(this, {
    uuid: '2A5C',
    properties: ['read']
  });
};

util.inherits(FeatureCharacteristic, Characteristic);

FeatureCharacteristic.prototype.onReadRequest = function(offset, callback) {
    // return hardcoded value
    // 000001 - 0x01 - Wheel Revolution Data Supported
    // 000010 - 0x02 - Crank Revolution Data Supported
    // 000100 - 0x04 - Walking or Running Status Supported
    
  var value = new Buffer(4);
  value.writeUInt32LE(0x01);
  callback(this.RESULT_SUCCESS, value);
};

module.exports = FeatureCharacteristic;
