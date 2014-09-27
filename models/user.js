var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  type:         String,
  username:     String,
  nickname:     String,
  phone:        String,
  sharePile:    Boolean,
  pile: {
    location:   String,
    longitude:  String,
    latitude:   String
  }
});

module.exports = mongoose.model('User', User);
