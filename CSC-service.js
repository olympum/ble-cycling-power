var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var CSCMeasurementCharacteristic = require('./CSC-measurement-characteristic');
var CSCFeatureCharacteristic = require('./CSC-feature-characteristic')
var CSCLocationCharacteristic = require('./cycling-sensor-location-characteristic')

function Service() {
  this.rsc = new CSCMeasurementCharacteristic();
  Service.super_.call(this, {
      uuid: '1816',
      characteristics: [
          this.rsc,
	  new CSCFeatureCharacteristic,
	  new CSCLocationCharacteristic
      ]
  });
  this.notify = function(event) {
    this.rsc.notify(event);
  }
}

util.inherits(Service, BlenoPrimaryService);

module.exports = Service;
