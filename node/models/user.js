var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    nickname: String,
    desc: String,
    wechat_id: String,
    phone: String,
    avatar: String,
    deviceToken: String,
    share_charger: Boolean,
    charger: {
        type: String,
        ref: 'HomeCharger'
    }
});

UserSchema.virtual('displayName').get(function() {
    if (this.nickname) return this.nickname;
    return this.username;
});

UserSchema.virtual('avatarUrl').get(function(){
    return '/upload/' +  this.avatar;
});

UserSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = mongoose.model('User', UserSchema);
