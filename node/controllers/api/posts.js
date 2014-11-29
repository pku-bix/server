var router = require('express').Router()
var User = require(process.cwd() + '/models/user')
var Post = require(process.cwd() + '/models/post')
var Reply = require(process.cwd() + '/models/reply')
var path = require('path')
var fs = require('fs')
var extend = require('util')._extend

router.route('/posts')
    .post(function (req, res, next) {
        User.findOne({
            username: req.body.author
        })
            .exec(function (err, user) {
                if (err) return next(err)
                if (!user) {
                    return next('user not found:', req.body.author);
                    user = new User({
                        username: req.body.author
                    });
                    user.save();
                }
                var images = Object.keys(req.files).map(function (key) {
                    return path.basename(req.files[key].path)
                });
                var post = new Post({
                    author: user.id,
                    content: req.body.content,
                    images: images
                });
                post.save(function (err, post) {
                    if (err) return next(err);
                    res.data = post;
                    next();
                })
            })
    })
    .get(function (req, res, next) {
        var cond = {};
        if (req.params.before) {
            cond.id = {
                $lt: req.params.before
            }
        }
        var limit = req.query.limit || 10
        Post.find(cond)
            .sort('-time')
            .limit(limit)
            .populate('author')
            .exec(function (err, posts) {
                if (err) return next(err)
                res.data = posts;
                next();
            });
    });

module.exports = router;
