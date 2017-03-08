var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var debug = require('debug')('csc');

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Spec
//https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.rsc_measurement.xml

var CSCMeasurementCharacteristic = function() {
  CSCMeasurementCharacteristic.super_.call(this, {
    uuid: '2A5B',
    properties: ['notify'],
    descriptors: [
      new Descriptor({
        // Client Characteristic Configuration
        uuid: '2902',
        value: new Buffer([0])
      })
    ]
  });

    this._updateValueCallback = null;

      console.log('[BLE] CSC intialized');

};

util.inherits(CSCMeasurementCharacteristic, Characteristic);

CSCMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('[BLE] client subscribed to CSC');
  this._updateValueCallback = updateValueCallback;
};

CSCMeasurementCharacteristic.prototype.onUnsubscribe = function() {
  console.log('[BLE] client unsubscribed from CSC');
  this._updateValueCallback = null;
};

var last_speed = Date.now();
var last_rev = 0;
var wheel_circ = 2095;

CSCMeasurementCharacteristic.prototype.notify = function(event) {
    if (!('speed_cm_s' in event)) {
	// ignore events with no relevant data
	return;
    }
    var buffer = new Buffer(12);
    buffer.fill(0);
    var flags = 0;
    // flags
    // 00000001 - 1   - 0x001 - Wheel Revolution Data Present
    // 00000010 - 2   - 0x002 - Crank Revolution Data Present
    var flags = 0;

    var now = Date.now();

    var pos = 2;
    if ('speed_cm_s' in event) {
	var delta = (now - last_speed);
	var speed = event.speed_cm_s * 10; // mm/s
	var rev = Math.floor (speed * delta / wheel_circ / 2000);
	debug ('now/last: ' + now +  ' / ' + last_speed);
	debug("speed: " + speed + " rev: " + rev + " delta : " + delta);
//	if (rev != 0) {
//	    last_rev += rev;
//	    last_speed += Math.floor ((wheel_circ * rev) / speed);
	    last_rev += 1;
	    last_speed += 2048;
	    debug("last_rev: " + last_rev + " at " + last_speed);
	    buffer.writeUInt32LE(last_rev, pos);
	    buffer.writeUInt16LE((last_speed)% 65536, pos+4);
	    pos += 6;
	    flags |= 0x01;
//	} else {
//	    debug ("NO full rev");
//	}
    }

    buffer.writeUInt16LE(flags, 0);

    debug ("Send: " + buffer.toString('hex'));
    if (this._updateValueCallback) {
	this._updateValueCallback(buffer);
    }

}

module.exports = CSCMeasurementCharacteristic;
