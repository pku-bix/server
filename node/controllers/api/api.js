/*
 * api.js: api controller
 *
 * Author: Harttle
 * http://harttle.github.io
 *
 * Date: Sun Nov 16 23:06:31 2014
 */

module.exports = function(app) {
    var router = require('express').Router();

    // request detail
    if (app.get('env') === 'development') {
        router.use(function(req, res, next) {
            console.log('------------------------------')
            console.log(req.ip, req.method, req.protocol + '://' + req.get('host') + req.originalUrl)
            console.log('headers:', req.headers)
            console.log('body:', req.body)
            next();
        })
    }

    router.use(require('./users'));
    router.use(require('./posts'));
    router.use(require('./chargers'));

    // response detail
    if (app.get('env') === 'development') {
        router.use(function(req, res, next) {
            console.log('------------------------------')
            console.log('RESPONSE:')
            console.log(res.data)
            next()
        })
    }

    // api render
    router.use(function(req, res, next) {
        res.send(res.data)
    })

    // api error handler
    router.use(errorHandler = function(err, req, res, next) {
        res.status(err.status || 400)
        res.send(err)
    })

    return router;
}
