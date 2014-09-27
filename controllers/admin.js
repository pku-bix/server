var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');

var router = express.Router();


router.get('/', function(req, res) {

  User.find({}, function(err, users){
    res.render('admin', { title: 'Bix 管理', 
                          user: req.user,
                          users: users })
  })
})


module.exports = router;
