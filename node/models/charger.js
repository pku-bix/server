var mongoose = require('mongoose');
var util = require('util');
var Schema = mongoose.Schema;

// extract a base class for charger
function BaseSchema() {
    Schema.apply(this, arguments);
    this.add({
        address: String,
        parkingnum: String,
        longitude: {type: String, required: true},
        latitude: {type: String, required: true},
        comment: String
    })
}
util.inherits(BaseSchema, Schema);

// instantiate the base
var ChargerSchema = new BaseSchema()

// instantiate the derived homecharger
var HomeChargerSchema = new BaseSchema({
    owner: {type: String, ref: 'User'}
})

// instantiate the derived supercharger
var SuperChargerSchema = new BaseSchema({
    name: String,
    hours: String,
    homepage: String
})

// instantiate the derived destination charger
var DestChargerSchema = new BaseSchema({
    name: String
})

var Charger = mongoose.model('Charger', ChargerSchema);
var HomeCharger = Charger.discriminator('HomeCharger', HomeChargerSchema);
var SuperCharger = Charger.discriminator('SuperCharger', SuperChargerSchema);
var DestCharger = Charger.discriminator('DestCharger', DestChargerSchema);


DestChargerSchema.virtual('type').get(function () {
    return this['__t'];
});

HomeChargerSchema.virtual('type').get(function () {
    return this['__t'];
});

SuperChargerSchema.virtual('type').get(function () {
    return this['__t'];
});

DestChargerSchema.set('toJSON', {
    getters: true, virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__t;
        delete ret.__v;
    }
});
HomeChargerSchema.set('toJSON', {
    getters: true, virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__t;
        delete ret.__v;
    }
});
SuperChargerSchema.set('toJSON', {
    getters: true, virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__t;
        delete ret.__v;
    }
});

module.exports = {
    Charger: Charger,
    HomeCharger: HomeCharger,
    SuperCharger: SuperCharger,
    DestCharger: DestCharger
}
