var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var lwip = require('lwip');
var str = require(process.cwd() + '/utils/str');

var UserSchema = new Schema({
    username: String,
    nickname: String,
    signature: String,
    wechat_id: String,
    tesla_model: String,
    phone: String,
    avatar: String,
    device_token: String,
    share_charger: {type: Boolean, default: false},
    charger: {
        type: String,
        ref: 'HomeCharger'
    }
});

UserSchema.set('toJSON', {
    getters: true, virtuals: true,
    transform: function (doc, ret, options) {
        ret.avatar = '/upload/' + ret.avatar;
        ret.avatar_thumbnail = str.appendName(ret.avatar, '-64');
        delete ret._id;
    }
});

module.exports = mongoose.model('User', UserSchema);
