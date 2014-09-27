var passport = require('passport')
var userSchema = require('../models/user.js')
var router = require('express').Router()


// index
router.get('/', function(req, res) {
  res.render('index', { title: 'Bix'});
})


router.get('/login', function(req, res) {
  if(req.user) return onLogin(req, res)
  res.render('login', { title: '登录到 Bix'});
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
      return onLogin(req, res)
    });
  })(req, res, next);
})


function onLogin(req, res){
  if(req.session.next){
    var next  = req.session.next
    delete req.session.next
  }
  if(!next) next='/admin'
  res.redirect(next)
}


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
