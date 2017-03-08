var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var MeasurementCharacteristic = require('./RSC-measurement-characteristic');
var FeatureCharacteristic = require('./RSC-feature-characteristic')

function Service() {
  this.rsc = new MeasurementCharacteristic();
  Service.super_.call(this, {
      uuid: '1814',
      characteristics: [
          this.rsc,
	  new FeatureCharacteristic
      ]
  });
  this.notify = function(event) {
    this.rsc.notify(event);
  }
}

util.inherits(Service, BlenoPrimaryService);

module.exports = Service;
