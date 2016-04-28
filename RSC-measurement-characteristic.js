var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var debug = require('debug')('rsc');

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Spec
//https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.rsc_measurement.xml

var RSCMeasurementCharacteristic = function() {
  RSCMeasurementCharacteristic.super_.call(this, {
    uuid: '2A53',
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

      console.log('[BLE] RSC intialized');

};

util.inherits(RSCMeasurementCharacteristic, Characteristic);

RSCMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('[BLE] client subscribed to RSC');
  this._updateValueCallback = updateValueCallback;
};

RSCMeasurementCharacteristic.prototype.onUnsubscribe = function() {
  console.log('[BLE] client unsubscribed from RSC');
  this._updateValueCallback = null;
};

RSCMeasurementCharacteristic.prototype.notify = function(event) {
  if (!('speed_dm_s' in event && 'strokes_per_min' in event) ) {
    // ignore events with no relevant data
    return;
  }
  var buffer = new Buffer(10);
  buffer.fill(0);
  var flags = 0;
  // flags
  // 00000001 - 1   - 0x001 - Instantaneous Stride Length Present
  // 00000010 - 2   - 0x002 - Total Distance Present
  var flags = 0;

  var speed = event.speed_dm_s;
  var spm = event.strokes_per_min;
  debug("speed: " + speed + " strokes per min: " + spm);
  buffer.writeUInt16LE(speed*256/10, 1);
  buffer.writeUInt8(spm, 3);

  if ('distance_dm' in event)
  {
    var dist = event.distance_dm;
    flags |= 0x02;
    debug("distance: " + dist);
    buffer.writeUInt32LE(dist, 4);
  }

  buffer.writeUInt8(flags, 0);

  debug ("Send: " + buffer.toString('hex'));
  if (this._updateValueCallback) {
    this._updateValueCallback(buffer);
  }
}

module.exports = RSCMeasurementCharacteristic;
