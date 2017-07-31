var fs = require('fs'),
    path = require('path'),
    isBemDirectoryExists = checkBemDirectory;

function checkBemDirectory(dir) {

    dir = path.normalize(dir);

    if (path.isAbsolute(dir) !== true) {
        return 'Provided dir should be absolute';
    }

    if (fs.existsSync(dir)) {

        if (fs.lstatSync(dir).isDirectory() === true) {
            return true;
        } else {
            return 'It looks like provided dir ' + dir + ' is not a directory.';
        }
    } else {
        return 'Can\'t find directory ' + dir;
    }
}

module.exports = isBemDirectoryExists;