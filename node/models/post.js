/*
 * post.js: post data model, used for moment page.
 *
 * Author: Harttle
 * http://harttle.github.io
 *
 * Date: Fri Nov  7 16:16:57 2014
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var str = require(process.cwd() + '/utils/str')

var PostSchema = new Schema({
    author: {type: String, ref: 'User'},
    content: {type: String, default: ''},
    time: {type: Date, default: Date.now},
    images: [String],
    replies: [{type: String, ref: "Reply"}]
});

PostSchema.set('toJSON', {
    getters: true, virtuals: true,
    transform: function (doc, ret, options) {
        ret.images = ret.images.map(function (img) {
            return '/upload/' + img;
        });

        ret.images_thumbnail = ret.images.map(function (img) {
            return str.appendName(img, '-64');
        });

        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Post', PostSchema);
