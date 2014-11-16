/*
 * controllers/api-users.js: users api: queries & updates
 *
 * Author: Harttle
 * http://harttle.github.io
 *
 * Date: Sat Nov 15 00:22:00 2014
 */

var router = require('express').Router()
var path = require('path')
var fs = require('fs')
var User = require('../models/user')
var extend = require('util')._extend

router.route('/user/:username')
    .get(function(req, res, next) {
        User.findOne({
                username: req.params.username
            })
            .populate('charger')
            .exec(function(err, user) {
                if (err) return next(err)
                res.send(extend(user, {
                    avatar: ['http:/', req.headers.host, 'upload', user.avatar].join('/')
                }))
            })
    })
    .post(function(req, res, next) {
        var patch = {
            username: req.params.username
        };
        if (req.files.avatar)
            patch.avatar = path.basename(req.files.avatar.path);
        User.update(patch, req.body, {
                upsert: true // update or insert
            },
            function(err, numberAffected, raw) {
                if (err) return next(err);
                res.send({
                    raw: raw
                });
            })
    })

module.exports = router;


// file rename approach, may be useful some day
//var rawpath = req.files.avatar.path
//var dstpath = process.cwd() + '/public/avatar/' + req.params.username + path.extname(rawpath)
//fs.rename(rawpath, dstpath, function(err) {
//  if (err) return next(err)
//  res.send(raw)
//})
