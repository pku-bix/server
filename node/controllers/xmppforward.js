var router = require('express').Router()
var User = require('../models/user')
var apn = require('apn');


router.post('/offline', function(req, res) {
    var options = {};

    var apnConnection = new apn.Connection(options);

    var myDevice = new apn.Device(token);

    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
    note.payload = {
        'messageFrom': 'Caroline'
    };

    apnConnection.pushNotification(note, myDevice);

})


module.exports = router;
