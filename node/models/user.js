var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username:     String,
  nickname:     String,
  desc:         String,
  wechat_id:    String,
  phone:        String,
  avatar:       String,
  share_charger:    Boolean,
  charger:      { type: String, ref: 'HomeCharger'}
});

module.exports = mongoose.model('User', UserSchema);
