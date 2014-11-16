var router = require('express').Router()
var User = require('../models/user')
var Post = require('../models/post')
var Reply = require('../models/reply')
var path = require('path')
var fs = require('fs')
var extend = require('util')._extend

router.route('/posts')
  .post(function(req, res, next) {
    User.findOne({
        username: req.params.username
      })
      .exec(function(err, user) {
        if (err) return next(err)
        var imgs = Object.keys(req.files).map(function(key){
            return path.basename(req.files[key].path)
        })
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
    var cond = {}
    if (req.params.before) {
      cond['_id'] = {
        $lt: req.params.before
      }
    }
    var limit = req.params.limit || 10
    Post.find(cond)
      .limit(limit)
      .populate('owner')
      .exec(function(err, posts) {
        if (err) return next(err)
        res.send(posts.map(function(post){
            return extend(post, {
                imgs: post.imgs.map(function(img){
                    return ['http:/', req.headers.host, 'upload', img].join('/');
                })
            })
        }))
      })
  })

module.exports = router;
