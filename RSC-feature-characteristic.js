var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Profile:
// https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.rsc_feature.xml

var FeatureCharacteristic = function() {
  FeatureCharacteristic.super_.call(this, {
    uuid: '2A54',
    properties: ['read']
  });
};

util.inherits(FeatureCharacteristic, Characteristic);

FeatureCharacteristic.prototype.onReadRequest = function(offset, callback) {
    // return hardcoded value
    // 000001 - 0x01 - Instantaneous Stride Length Measurement Supported
    // 000010 - 0x02 - Total Distance Measurement Supported
    // 000100 - 0x04 - Walking or Running Status Supported
    // 001000 - 0x08 - Calibration Procedure Supported
    // 010000 - 0x10 - Multiple Sensor Locations Supported
    
  var value = new Buffer(4);
  value.writeUInt32LE(0x02);
  callback(this.RESULT_SUCCESS, value);
};

module.exports = FeatureCharacteristic;
