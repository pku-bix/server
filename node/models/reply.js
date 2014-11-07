/*
* reply.js: reply data model, used for moment page.
* 
* Author: Harttle
* http://harttle.github.io
* 
* Date: Fri Nov  7 16:16:57 2014
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReplySchema = new Schema({
  author:   { type: String, ref: 'User'},
  text:     String,
  time:     Date,
  replies:  { type: String, ref: "User"}, // replies sb.
});

module.exports = mongoose.model('Reply', ReplySchema);
