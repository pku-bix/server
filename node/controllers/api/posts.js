var router = require('express').Router()
var User = require(process.cwd() + '/models/user')
var Post = require(process.cwd() + '/models/post')
var Reply = require(process.cwd() + '/models/reply')
var thumb = require(process.cwd() + '/utils/thumb')
var path = require('path')
var fs = require('fs')
var extend = require('util')._extend

router.route('/posts')
    .post(function(req, res, next) {
        User.findOne({
                username: req.body.author
            })
            .exec(function(err, user) {
                if (!user) {
                    user = new User({
                        username: req.body.author
                    });
                    user.save();
                }
                var images = Object.keys(req.files).map(function(key) {
                    var filepath = req.files[key].path;
                    thumb.resize(filepath);
                    return path.basename(filepath)
                });
                var post = new Post({
                    author: user.id,
                    content: req.body.content,
                    images: images
                });
                post.save(function(err, post) {
                    res.data = post;
                    next();
                })
            })
    })
    .get(function(req, res, next) {
        var cond = {};
        if (req.query.before) {
            cond.id = {
                $lt: req.params.before
            }
        }
        var limit = req.query.limit || 10
        Post.find(cond)
            .sort('-time')
            .limit(limit)
            .populate('author')
            .exec(function(err, posts) {
                if (err) return next(err)
                res.data = posts;
                next();
            });
    });

module.exports = router;
