var User = require('../models/user')
var mongoose = require('mongoose')
var fs = require('fs')
var extend = require('util')._extend
var db = mongoose.connect('mongodb://localhost/bix')

// update users of type from file
function update(type){

  // remove users
  User.remove({type: type})

  // load users
  fs.readFile('./'+type+'s.dat','utf-8',function(err,dat){
    if(err) {
      console.error(err)
      return
    }
    var superChargers = JSON.parse(dat)
    for(var i in superChargers){
      for(var j in superChargers[i].cities){
        for(var k in superChargers[i].cities[j].providers){
          var provider = superChargers[i].cities[j].providers[k]
          var user = new User(extend({ type:type }, provider))
          user.save()
        }
      }
    }
    db.disconnect()
  })
}

update('superCharger')
update('destinationCharger')
