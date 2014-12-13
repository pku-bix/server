var router = require('express').Router()
var User = require(process.cwd() + '/models/user')
var apn = require('apn');

module.exports = function(app) {

    // xmpp forward config
    router.use(require('./offline'))

    if (app.get('env') === 'development') {
        router.use(devErrorHandler)
    }
    else router.use(prodErrorHandler)


    // error handlers
    function devErrorHandler(err, req, res, next) {
        console.error('error occurred in xmpp-forward:', 
            err.message || err || 'unkown error');
        console.error(err.stack || 'no stack info')
        res.end();
    };

    function prodErrorHandler (err, req, res, next) {
        console.error('error occurred in xmpp-forward:', 
            err.message || err || 'unknown error');
        res.end();
    };

    return router;
}
