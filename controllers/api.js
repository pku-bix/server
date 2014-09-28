var router = require('express').Router()
var User = require('../models/user')


router.get('/piles', function(req,res){
  User.find({ type : 'pile' }, 'type pile', function(err, users){
    json_render(res, err, users)
  })
})


router.get('/user/:username', function(req, res){
  User.findOne({ type:'user', username: req.params.username }, function(err, user){
    json_render(res, err, user)
  })
})

router.get('/pile/:id', function(req, res){
  User.findOne({ _id : req.params.id }, function(err, user){
    json_render(res, err, user)
  })
})


router.post('/user/add', function(req, res){
  var user = new User({
    type:     req.body.type,
    username:req.body.username,
    nickname: req.body.nickname,
    phone   :req.body.phone,
    pile    :{
      location:req.body.location,
      longitude : req.body.lng,
      latitude  : req.body.lat
    }
  })
  user.save(function (err, user) {
    json_render(res, err, '')
  })
})

router.post('/user/delete',function(req, res){
  User.findOneAndRemove({ username : req.body.username },function(err, r){
    json_render(res, err, '')
  })
})

router.post('/pile/delete',function(req, res){
  User.findOneAndRemove({ _id : req.body.id },function(err, r){
    json_render(res, err, '')
  })
})

function json_render(res, error, result){
  if(error){
    var json = {
      status:   'error',
      error:    error
    }
  }
  else{
    var json = {
      status:   'success',
      result:   result
    }
  }
  res.send(JSON.stringify(json));
}


module.exports = router;
