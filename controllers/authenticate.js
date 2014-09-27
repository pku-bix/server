var router  = require('express').Router();

// do authentication check
// authenticated ? controller : redirect
// 
module.exports = function(controller, loginUrl){
  if(typeof loginUrl == 'undefined')  loginUrl = '/login'

  return function(req,res,next){
    if(req.user)
      controller(req,res,next)
    else{
      req.session.next = req.originalUrl
      res.redirect('/login')
    }
  }
}
