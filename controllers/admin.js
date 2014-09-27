var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');
var async = require('async')

var router = express.Router();


router.get('/', function(req, res) {

  async.parallel(
  {
    pileUsers:    function(callback){
                    User.find({type: 'superpile'}, callback);
                  },
    normalUsers:  function(callback){
                    User.find({type: 'normal'}, callback);
                  },
    adminUsers:  function(callback){
                    User.find({type: 'admin'}, callback);
                  }
  }, 
  function(err, result){
    res.render('admin', { title: 'Bix 管理', user: req.user,
      pileUsers:    result.superUsers,
      normalUsers:  result.normalUsers,
      adminUsers:   result.adminUsers,
      apiToken:     req.user.getToken()
    });
  });
});


module.exports = router;
