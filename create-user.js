var mongoose = require('mongoose')
var User = require("./models/user")


mongoose.connect('mongodb://localhost/bix')

User.remove({}, function(err,users){
  if(err) console.log(err)
  else  console.log('users cleared')
})


function register(user, pswd){
  User.register(new User(user), pswd, function(err, user) {
      if (err) {
        console.log(err);
      }
      else{
        console.log("user created:")
        console.log(user)
      }
  })
}

register({ 
    username : 'a', sharePile: true, phone: '15210597519', type: 'admin', 
    pile: {
      location: '中关村', longitude: '1.1111', latitude:   '2.222' }},
    'b');

register({ 
    username : 'b', sharePile: true, phone: '15210597512', type: 'normal', 
    pile: {
      location: '中关村', longitude: '1.1111', latitude:   '2.222' }},
    'b');
