var router = require('express').Router()
var User = require(process.cwd() + '/models/user')
var Post = require(process.cwd() + '/models/post')
var Reply = require(process.cwd() + '/models/reply')
var str = require(process.cwd() + '/utils/str')
var path = require('path')
var fs = require('fs')
var extend = require('util')._extend
var lwip = require('lwip')

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
                    lwip.open(filepath, function(err, image) {
                        if (err) {
                            console.info('could not open image:', err);
                            return;
                        }
                        image.resize(64, 64, function(err, image) {
                            if (err) {
                                console.info('resize image error:', err);
                                return;
                            }
                            image.writeFile(str.appendName(filepath, '-64'),
                                function(err) {
                                    if (err) console.info('save resized image error:', err)
                                });
                        });
                    });
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
            .exec(function(err, posts) {
                if (err) return next(err)
                res.data = posts;
                next();
            });
    });

module.exports = router;
