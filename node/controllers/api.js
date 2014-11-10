var router = require('express').Router()
var Charger = require('../models/charger').Charger
var HomeCharger = require('../models/charger').HomeCharger
var SuperCharger = require('../models/charger').SuperCharger
var DestCharger = require('../models/charger').DestCharger
var User = require('../models/user')
var Post = require('../models/post')
var Reply = require('../models/reply')
var path = require('path')
var fs = require('fs')

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
      if (err) {
        return next(err)
      }

      user.save(function(err, user, num) {
        if (err) return next(err);
        res.send({
          charger: charger
        })
      })
    })
  })
})


// user queries & updates
router.route('/user/:username')
  .get(function(req, res, next) {

    User.findOne({
        username: req.params.username
      })
      .populate('charger')
      .exec(function(err, user) {
        if (err) return next(err)
        res.send({
          user: user
        })
      })
  })
  .post(function(req, res, next) {
    User.update({
        username: req.params.username
      },
      req.body, {
        upsert: true // update or insert
      },
      function(err, numberAffected, raw) {
        if (err) return next(err);

        if (req.files.avatar) {
          var rawpath = req.files.avatar.path
            // todo: provide url by user model
          var dstpath = process.cwd() + '/public/avatar/' + req.params.username + path.extname(rawpath)
          fs.rename(rawpath, dstpath, function(err) {
            if (err) return next(err)
            res.send(raw)
          })
        } else res.send({
          raw: raw
        })
      })
  })

router.route('/posts')
  .post(function(req, res, next) {
    User.findOne({
        username: req.params.username
      })
      .exec(function(err, user) {
        if (err) return next(err)
        var imgs = []
        for (i in req.files) {
          imgs.push(path.basename(req.files[i].path))
        }
        var post = new Post({
          author: user.id,
          text: req.params.author,
          time: new Date(),
          imgs: imgs,
        })
        post.save(function(err, post) {
          if (err) return next(err)
          res.send(post)
        })
      })
  })
  .get(function(req, res, next) {

    // before param
    var cond = {}
    if (req.params.before) {
      cond['_id'] = {
        $lt: req.params.before
      }
    }

    // limit param
    var limit = req.params.limit || 10

    Post.find(cond)
      .limit(limit)
      .populate('owner')
      .exec(function(err, posts) {
        if (err) return next(err)
        res.send(posts)
      })
  })


// error handler, must be four params!
router.use(function(err, req, res, next) {
  res.status(err.status || 400)
  res.json(err)
})

module.exports = router;
