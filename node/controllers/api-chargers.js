/*
* controllers/chargers.js: chargers api
*
* Author: Harttle
* http://harttle.github.io
*
* Date: Sat Nov 15 00:19:17 2014
*/

var router = require('express').Router()
var Charger = require('../models/charger').Charger
var HomeCharger = require('../models/charger').HomeCharger
var SuperCharger = require('../models/charger').SuperCharger
var DestCharger = require('../models/charger').DestCharger

// charger query
router.get('/chargers', function(req, res, next) {
  Charger.find({
    enabled: true
  }, '_type longitude latitude detailedaddress', function(err, chargers) {
    if (err) next(err)
    else res.send({
      chargers: chargers
    })
  })
})

// charger detail
router.get('/charger/:id', function(req, res, next) {
  Charger.findById(req.params.id, function(err, charger) {
    if (err) next(err)
    else res.send({
      charger: charger
    })
  })
})

// home charger post
router.post('/charger', function(req, res, next) {
  var charger = new HomeCharger(req.body)
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) return next(err)
    if (!user) return next('user not found: ' + req.body.username)

    charger.owner = user.id
    user.charger = charger.id
    user.share_charger = true
    charger.save(function(err, charger, num) {
      if (err) return next(err)
      user.save(function(err, user, num) {
        if (err) return next(err);
        res.send({
          charger: charger
        })
      })
    })
  })
})

module.exports = router;
