/*
 * api.js: api controller
 *
 * Author: Harttle
 * http://harttle.github.io
 *
 * Date: Sun Nov 16 23:06:31 2014
 */

module.exports = function(app) {

    // router config
    var router = require('express').Router();

    router.use(require('./users'));
    router.use(require('./posts'));
    router.use(require('./chargers'));

    router.use(render);
    if (app.get('env') === 'development') {
        router.use(devErrorHandler);
    }
    router.use(errorHandler);


    // middle wares

    function render(req, res, next) {
        if (res.data) return res.send(res.data)

        // catch 404
        var err = new Error('Api Not Found');
        err.status = 404;
        next(err);
    }

    function devErrorHandler(err, req, res, next) {
        console.error(err.stack || err.message || err);
        next(err);
    }

    function errorHandler(err, req, res, next) {
        // treat string error as bad requests
        var stat = err.status || (err.message ? 500 : 400);
        res.status(stat);
        res.send({
            status: stat,
            message: err.message || err
        });
    }

    return router;
}
