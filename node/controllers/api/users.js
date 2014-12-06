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
var User = require(process.cwd() + '/models/user')
var extend = require('util')._extend
var thumb = require(process.cwd() + '/utils/thumb')

router.route('/user/:username')
    .get(function(req, res, next) {
        User.findOne({
                username: req.params.username
            })
            .populate('charger')
            .exec(function(err, user) {
                if (err) return next(err);
                if (!user) return next('user not found: ' + req.params.username);
                res.data = user;
                next();
            })
    })
    .post(function(req, res, next) {
        var patch = req.body;
        if (req.files.avatar) {
            patch.avatar = path.basename(req.files.avatar.path);
            thumb.resize(req.files.avatar.path);
        }

        User.update({
                username: req.params.username
            }, patch, {
                upsert: true // update or insert
            },
            function(err, numberAffected, raw) {
                if (err) return next(err);
                res.data = {
                    raw: raw
                };
                next();
            })
    })

module.exports = router;
