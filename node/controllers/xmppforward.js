var router = require('express').Router()
var User = require('../models/user')


router.post('/offline', function(req,res){
  console.log(req.body)
  res.send()
})


module.exports = router;
