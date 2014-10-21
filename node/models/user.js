var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username:     String,
  nickname:     String,
  desc:         String,
  wechat_id:    String,
  phone:        String,
  share_charger:    Boolean,
  charger:      { type: Schema.Types.ObjectId, ref: 'HomeCharger'}
});

module.exports = mongoose.model('User', UserSchema);
