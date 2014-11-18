var router = require('express').Router()
var User = require(process.cwd() + '/models/user')
var apn = require('apn');

router.post('/offline', function(req, res) {

    // retrieve from user
    User.findOne({
        username: req.body.from.slice(0, req.body.from.indexOf('@'))
    }, function(err, fuser) {
        if (err) return next(err);
        if (!fuser) return next('user for', req.body.from, 'not found');

        // retrieve to user
        User.findOne({
            username: req.body.to.slice(0, req.body.to.indexOf('@'))
        }, function(err, tuser) {

            if (!tuser.deviceToken) return next('deviceToken for', req.body.to, 'not found');
            var device = new apn.Device(tuser.deviceToken);

            var options = {
                cert: process.cwd() + '/cert/cert.pem',
                /* Certificate file path */
                key: process.cwd() + '/cert/key.pem',
                /* Key file path */
                gateway: 'gateway.sandbox.push.apple.com',
                /* gateway address */
                port: 2195,
                /* gateway port */
                errorCallback: errorHandler,
                /* Callback when error occurs function(err,notification) */
            };
            var apnConnection = new apn.Connection(options);

            // APN  payload doc
            // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
            var note = new apn.Notification();
            note.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // Expires 24 hour from now.
            note.badge = 1;
            note.sound = "ping.aiff";
            note.alert = req.body.body;
            note.payload = {
                'messageFrom': fuser.displayName
            };

            apnConnection.pushNotification(note, myDevice);

            res.end()
        })
    })
})

var errorHandler = function(err, notification) {
    console.err('APN error:', err)
    console.err(notification)
}

module.exports = router;
