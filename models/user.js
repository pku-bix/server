var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  type:         String,

// user
  username:     String,
  nickname:     String,
  phone:        String,
  share_charger:    Boolean,

// super charger
  sup_id:       String,
  province :    String,
  city :        String,
  address :     String,
  parkingnum :  String,
  longitude :   String,
  latitude :    String,
  time :        String,
  is_delete :   String,
  detailedaddress :       String,
  opened :      String,
  detailpage:   String,

// des
  destinationcharging_id :        String,
  name :        String,
  //detailedaddress :       String,
  //province :    String,
  //city :        String,
  //parkingnum :  String,
  //longitude :   String,
  //latitude :    String,
  info :        String,
  //is_delete:    String
});

module.exports = mongoose.model('User', User);
