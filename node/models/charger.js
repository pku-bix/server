var mongoose = require('mongoose');
var util = require('util');
var Schema = mongoose.Schema;

// extract a base class for charger
function BaseSchema() {
  Schema.apply(this, arguments);
  this.add({
    enabled:      Boolean,
    detailedaddress :       String,
    province :    String,
    city :        String,
    parkingnum :  String,
    longitude :   String,
    latitude :    String
  })
  this.validate = function(){
    return this.longitude && this.latitude
  }
}
util.inherits(BaseSchema, Schema);

// instantiate the base
var ChargerSchema = new BaseSchema()

// instantiate the derived homecharger
var HomeChargerSchema = new BaseSchema({
  owner:       { type: String, ref: 'User' }
})

// instantiate the derived supercharger
var SuperChargerSchema = new BaseSchema({
  sup_id:       String,
  address :     String,
  time :        String,
  opened :      String,
  detailpage:   String,

  name :        String,
  is_delete :   String
})

// instantiate the derived destination charger
var DestChargerSchema = new BaseSchema({
  destinationcharging_id :        String,
  info :        String,

  name :        String,
  is_delete :   String
})

var Charger = mongoose.model('Charger', ChargerSchema);
var HomeCharger  = Charger.discriminator('HomeCharger', HomeChargerSchema);
var SuperCharger = Charger.discriminator('SuperCharger', SuperChargerSchema);
var DestCharger  = Charger.discriminator('DestCharger',  DestChargerSchema);

module.exports = {
  Charger:      Charger,
  HomeCharger:  HomeCharger,
  SuperCharger: SuperCharger,
  DestCharger:  DestCharger
}
