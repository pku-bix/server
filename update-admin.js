var Admin = require('./admin')

var mongoose = require('mongoose')
var db = mongoose.connect('mongodb://localhost/bix')


Admin.remove({})


function register(u, p, callback){
  Admin.register(new Admin(u), p, function(err, admin) {
      if (err) console.log(err);
      else{
        console.log('admin created:')
        console.log(admin)
        if(typeof callback != 'undefined') callback()
      }
  })
}

register({ username : 'admin'}, '123456', function(){
  db.disconnect()
})

