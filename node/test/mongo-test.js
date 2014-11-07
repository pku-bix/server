var mongoose = require('mongoose')
var fs = require('fs')
var extend = require('util')._extend
var db = mongoose.connect('mongodb://localhost/bix')
var SuperCharger = require('../models/charger').SuperCharger
var DestCharger = require('../models/charger').DestCharger
var HomeCharger = require('../models/charger').HomeCharger
var User = require('../models/user')

//var user = new User({
//  username: 'test',
//  charger: '545c37dee691b79406882450'
//})
//
//user.save()
//

//var charger = HomeCharger({
//  latitude: 39.915299843424,
//  longitude: 116.37937007763,
//  city: 'beijing',
//})
//charger.save();


User.findOne({
  username: 'test'
}).populate('charger').exec(function(err, user){
  console.log(err, user)
  db.disconnect()
})

