var router = require('express').Router()
var Charger = require('../models/charger').Charger
var HomeCharger  = require('../models/charger').HomeCharger
var SuperCharger = require('../models/charger').SuperCharger
var DestCharger  = require('../models/charger').DestCharger
var User = require('../models/user')
var path = require('path')
var fs = require('fs')

// charger queries
router.get('/chargers', function(req,res,next){
  Charger.find({ enabled: true },
    '_type longitude latitude detailedaddress', 
    function(err, chargers){
      if(err) next(err)
      else res.send({ chargers:  chargers })
    })
})
.get('/charger/:id', function(req, res,next){
  Charger.findById(req.params.id, function(err, charger){
    if(err) next(err)
    else  res.send({ charger:  charger })
  })
})

// user queries & updates
router.route('/user/:username')
.get(function(req, res, next){
  User.findOne({username: req.params.username })
    .populate('charger')
    .exec(function(err, user){
      if(err) next(err)
      else  res.send({ user:  user })
    })
})
.post( function(req, res, next){
  User.update({username: req.params.username},
    req.body,
    { upsert: true },
    function(err, numberAffected, raw){
      if(err){ next(err); return } 

      if(req.files.avatar){
        var rawpath = req.files.avatar.path
        var dstpath = process.cwd() + '/public/avatar/'
                      + req.params.username + path.extname(rawpath)
        fs.rename(rawpath, dstpath, function(err){
          if(err) return next(err)

          res.send({ raw:  raw })
        })
      }
      else res.send({ raw:  raw })
    })
})

// error handler
router.use(function(err,req,res){
  res.json({ status: 'error', error:  err })
})

module.exports = router;
