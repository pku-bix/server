var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var jwt = require('jwt-simple');

var secret = 'harttle and dusx5';
var types = 'admin normal superpile'.split(' ')

var User = new Schema({
  type:         String,
  username:     String,
  password:     String,
  phone:        String,
  sharePile:    Boolean,
  pile: {
    location:   String,
    longitude:  String,
    latitude:   String
  }
});

User.plugin(passportLocalMongoose,{
  incorrectUsernameError: '用户名不正确',
  incorrectPasswordError: '密码不正确'
});

// 获得 API Token
User.methods.getToken = function(){
  return jwt.encode(this.username, secret);
}

// 是否有读权限
User.methods.canRead = function(username){
  return true;
}

// 是否有写权限
User.methods.canWrite = function(username){
  return this.type == 'admin' || this.username == username;
}

// 通过 Token 获得用户
User.statics.findByToken = function(token, callback){
  this.findOne({ username: jwt.decode(token, secret)}, callback);
}

module.exports = mongoose.model('User', User);
