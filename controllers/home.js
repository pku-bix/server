var express = require('express');
var passport = require('passport');
var userSchema = require('../models/user.js');

var router = express.Router();


router.get('/', function(req, res) {
  if(req.user)
    res.redirect('/admin')
  else
    res.render('index', { title: 'Bix'});
});

router.loginSuccess = function(req, res){
  var next = '/admin';

  if(req.session.next){
    next  = req.session.next;
    delete req.session.next;
  }
  return res.redirect(next);
}

router.get('/login', function(req, res) {
  if(req.user){
    router.loginSuccess(req, res)
  }
  res.render('login', { title: '登录到 Bix', next: req.next});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) { 
      return res.render('login', {
        title: '登录到 Bix', 
        error: info});
    }
    req.logIn(user, function(err) {
      if (err) return next(err);

      return router.loginSuccess(req, res)
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


router.LoginRequired = function(){
  return function(req,res,next){
    if(req.user)  next()
    else{
      req.session.next = req.originalUrl
      //console.log('set req.session.next:'+req.session.next)
      res.redirect('/login')
    }
  }
}

module.exports = router;
