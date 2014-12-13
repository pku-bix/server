var router = require('express').Router()
var User = require(process.cwd() + '/models/user')
var apn = require('apn');

// APN doc:
// https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Introduction.html

// Node apn wiki:
// https://github.com/argon/node-apn/wiki

router.post('/offline', function(req, res, next) {

    var fusername = req.body.from.slice(0, req.body.from.indexOf('@'))
    var tusername = req.body.to.slice(0, req.body.to.indexOf('@'))

    if (!fusername || !tusername) next(new Error('from/to not defined'));

    User.findOne({ username: fusername },
        function(err, fuser) {
            if (err) return next(err);
            if (!fuser) {
                fuser = new User({ username: fusername });
                fuser.save();
            }

            User.findOne({
                username: tusername
            }, function(err, tuser) {
                if (!tuser || !tuser.device_token)
                    return next('device token for ' + tusername + ' not found');

                // init connection
                var options = {
                    production: false,
                    cert: process.cwd() + '/cert/cert.pem',
                    key: process.cwd() + '/cert/key.pem',
                    gateway: 'gateway.sandbox.push.apple.com',
                    port: 2195
                };
                var service = new apn.Connection(options);
                service.on('connected', function() {
                    console.log("Connected");
                });

                service.on('transmitted', function(notification, device) {
                    console.log("Notification transmitted to:" + device.token.toString('hex'));
                });

                service.on('transmissionError', function(errCode, notification, device) {
                    console.error("Notification caused error: " + errCode + " for device ", device, notification);
                    if (errCode == 8) {
                        console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
                    }
                });

                service.on('timeout', function() {
                    console.log("Connection Timeout");
                });

                service.on('disconnected', function() {
                    console.log("Disconnected from APNS");
                });

                service.on('socketError', console.error);


                // create notification
                var note = new apn.Notification();
                note.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // Expires 24 hour
                note.badge = 1;
                note.sound = "ping.aiff";
                note.alert = req.body.body;
                note.payload = {
                    'messageFrom': fuser.nickname || fuser.username
                };

                // get device
                var device = new apn.Device(tuser.device_token);

                // push!
                service.pushNotification(note, device);

                res.send('rogger!')
            })
        })
})

module.exports = router;
