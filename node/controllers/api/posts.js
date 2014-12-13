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
                    user = new User({ username: req.body.author });
                    user.save();
                }

                var images = req.files.images;
                // tolerate object & undefined
                if (!images) images = [];
                else if (!(images instanceof Array)) {
                    images = [images];
                }

                images = images.map(function(file) {
                    thumb.resize(file.path);
                    return path.basename(file.path)
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
            cond._id = {
                $lt: req.query.before
            }
        };
        var limit = req.query.limit || 10
        Post.find(cond)
            .sort({
                _id: -1
            })
            .limit(limit)
            .populate('author')
            .exec(function(err, posts) {
                if (err) return next(err)
                res.data = posts;
                next();
            });
    });

module.exports = router;
