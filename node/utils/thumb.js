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

var thumb = function() {
    var self = this;
    this.appendName = function(opath, str) {
        var ext = path.extname(opath);
        var extl = ext.length;
        var length = extl ? -extl : undefined;

        return opath.slice(0, length) + str + ext;
    };

    this.thumbPath = function(imagePath) {
        var thumbPath = self.appendName(imagePath, '-64');
        var thumbFilePath = process.cwd() + '/public' + thumbPath;

        return fs.existsSync(thumbFilePath) ? thumbPath : imagePath;
    };

    this.resize = function(file) {
        try {
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
                    image.writeFile(self.appendName(file, '-64'),
                        function(err) {
                            if (err) console.info('save resized image error:', err)
                        });
                });
            });
        } catch (e) {
            console.info(file, 'resize error:', e)
        }
    }
}

module.exports = new thumb();
