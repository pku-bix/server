/*
 * utils/path.js: path processing
 *
 * Author: Harttle
 * http://harttle.github.io
 *
 * Date: Sat Dec  6 01:51:13 2014
*/

var path = require('path')

module.exports = {
    appendName: function(opath, str){
        
        var ext = path.extname(opath);
        var extl = ext.length;
        var length = extl ? -extl : undefined;

        return opath.slice(0, length) + str + ext;
    }
}
