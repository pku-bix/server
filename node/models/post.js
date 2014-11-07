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

var PostSchema = new Schema({
  author:   { type: String, ref: 'User'},
  text:     String,
  time:     Date,
  imgs:     [String],
  replies:  [ { type: String, ref: "Reply"} ],
});

module.exports = mongoose.model('Post', PostSchema);
