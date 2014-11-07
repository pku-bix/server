// file：web admin user model
// author: harttle, yangjvn@126.com

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var Admin = new Schema({
  username:     String,
  password:     String
});

Admin.plugin(passportLocalMongoose,{
  incorrectUsernameError: '用户名不正确',
  incorrectPasswordError: '密码不正确'
});

module.exports = mongoose.model('Admin', Admin);
