/*
 * utils/path.js: path processing
 *
 * Author: Harttle
 * http://harttle.github.io
 *
 * Date: Sat Dec  6 01:51:13 2014
 */

var path = require('path')
var lwip = require('lwip')
var fs = require('fs')

module.exports = {
    appendName: function(opath, str) {
        var ext = path.extname(opath);
        var extl = ext.length;
        var length = extl ? -extl : undefined;

        return opath.slice(0, length) + str + ext;
    },
    thumbPath: function(imagePath) {
        var thumbPath = this.appendName(imagePath, '-64');
        var thumbFilePath = process.cwd() + '/public' + thumbPath;

        return fs.existsSync(thumbFilePath) ? thumbPath : imagePath;
    },
    resize: function(file) {
        lwip.open(file, function(err, image) {
            if (err) {
                console.info('could not open image:', err);
                return;
            }
            image.resize(64, 64, function(err, image) {
                if (err) {
                    console.info('resize image error:', err);
                    return;
                }
                image.writeFile(str.appendName(filepath, '-64'),
                    function(err) {
                        if (err) console.info('save resized image error:', err)
                    });
            });
        });
    }
}
