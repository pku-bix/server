// update chargers from file

var mongoose = require('mongoose')
var fs = require('fs')
var extend = require('util')._extend
var db = mongoose.connect('mongodb://localhost/bix')
var Charger = require('../models/charger').Charger
var SuperCharger = require('../models/charger').SuperCharger
var DestCharger = require('../models/charger').DestCharger

function update(filename, constructor) {
    fs.readFile(filename, 'utf-8', function (err, dat) {
        if (err) {
            console.log(err);
            return;
        }
        var provinces = JSON.parse(dat)

        for (var i in provinces) {
            for (var j in provinces[i].cities) {
                provinces[i].cities[j].providers
                    .forEach(function (provider) {
                        var charger = constructor(provider);

                        extend(charger, {
                            name: provider.name,
                            address: provider.detailedaddress,
                            parkingnum: provider.parkingnum,
                            longitude: provider.longitude,
                            latitude: provider.latitude,
                            comment: provider.info || ''
                        });

                        charger.save();
                    })
            }
        }
        db.disconnect();
    })
}

//Charger.remove({}).exec();

update('superChargers.dat', function (provider) {
    return new SuperCharger({
        hours: provider.time,
        homepage: provider.detailpage
    });
});

update('destinationChargers.dat', function (provider) {
    return new DestCharger({
    });
});
