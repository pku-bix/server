// update chargers from file

var mongoose = require('mongoose')
var fs = require('fs')
var extend = require('util')._extend
var db = mongoose.connect('mongodb://localhost/bix')
var Charger = require('../models/charger').Charger
var SuperCharger = require('../models/charger').SuperCharger
var DestCharger  = require('../models/charger').DestCharger

function update(filename, Type){
  fs.readFile(filename,'utf-8',function(err,dat){
    if(err){
      console.log(err)
      return
    }

    // first, remove all
    // Type.remove({})

    // second, load new
    var provinces = JSON.parse(dat)

    for(var i in provinces){
      for(var j in provinces[i].cities){
        provinces[i].cities[j].providers
          .forEach(function(provider){
            var charger = new Type(extend({ enabled:true }, provider))
            charger.save()
          })
      }
    }
    db.disconnect()
  })
}

Charger.remove({ })
update('superChargers.dat',SuperCharger)
update('destinationChargers.dat',DestCharger)
