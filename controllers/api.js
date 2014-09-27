var express = require('express');
var passport = require('passport');
var User = require('../models/user')

var router = express.Router();


router.get('/hello', function(req, res) {
  res.send('hello!')
});

router.get('/token', function(req, res, next) {
  if(!req.query.username || !req.query.password){
    var json = {
      status:   'error',
      message:  '请提供用户名与密码'
    }
    res.send(JSON.stringify(json));
    return;
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err);
    }
    if (!user) { 
      var json = {
        status:   'error',
        message:  info.message
      }
    }
    else{
      var token = user.getToken();
      var json = {
        status:   'success',
        token:    token
      }
    }
    res.send(JSON.stringify(json));
  })(req, res, next);
});

router.get('/user/:username', function(req, res){

  if(!req.query.token){
    var json = {
      status:   'error',
      message:  '请提供token'
    }
    res.send(JSON.stringify(json));
    return;
  }
  User.findByToken(req.query.token, function(err, user){
    if(err){
      var json = {
        status:   'error',
        message:  'token无效'
      }
    }
    else{
      var json = {
        status:   'success',
        user:     user
      }
    }
    res.send(JSON.stringify(json));
  });
});

module.exports = router;
