/*
* controllers/api-error.js: error handlers
*
* Author: Harttle
* http://harttle.github.io
*
* Date: Sat Nov 15 00:24:18 2014
*/

var router = require('express').Router()

// error handler, must be four params!
router.use(function(err, req, res, next) {
  res.status(err.status || 400)
  res.json(err)
})

module.exports = router;
